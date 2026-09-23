import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { EmptyList, RentDescription } from "../../../components/info";
import SplashScreen from "../../../components/splash-screen";
import type { PaginationParams } from "../../../types/global";
import { GetAllPropertyMembers } from "../../property-registration/api";
import type { GetAllPropertyMemberInfo } from "../../property-registration/api.response";
import { PropertyMemberCard } from "../../property-registration/components/property-members/property-member-card";
import type { StatusPropertyMemberType } from "../../property-registration/schemas/property-registration.schema";

//rich text editor
import { RichEditor } from "react-native-pell-rich-editor";
import { useMe } from "../../../stores/auth-store";
import { CreateContractDraft } from "../api";
import type { CreateContractDraftType } from "../schemas/contract.schema";
import
  {
    ExtractContractInformationOfHTML,
    INITIAL_CONTRACT_DRAFT,
  } from "../services/helper";

//este componente nos permite seleccionar al miembro que deseamos crearle su respectivo contrato
export function SelectedPropertyMemberForContractDraft({
  propertyId,
  setPropertyMember,
}: {
  propertyId: string;
  setPropertyMember: React.Dispatch<
    React.SetStateAction<GetAllPropertyMemberInfo | null>
  >;
}) {
  const [pagination, setPagination] = useState<
    PaginationParams & { status: StatusPropertyMemberType }
  >({
    limit: 10,
    page: 1,
    status: "ACTIVE",
  });

  //obtenemos todos los miembros activos a la propiedad
  //nos aprovechamos de la cache de tanstack query para
  //obetener la rsepuesta si esta cacheada
  const {
    isLoading,
    isError,
    data: propertyMembers,
  } = useQuery({
    queryKey: ["propertyMembers", propertyId],
    queryFn: () =>
      GetAllPropertyMembers(
        propertyId,
        pagination.page,
        pagination.limit,
        pagination.status,
      ),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener los miembros de propiedad!" />
    );
  }

  if (!propertyMembers) {
    return null;
  }

  return (
    <View style={selectedPropertyMemberStyles.container}>
      <RentDescription
        title="Elige el arrendado!"
        description="Escoge a la persona a la cual se le generará el borrador de contrato"
      />

      <FlatList
        data={propertyMembers.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyMemberCard
            name={item.fullname}
            roles={item.roles}
            status={item.status}
            action={() => setPropertyMember(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={selectedPropertyMemberStyles.propertyMemberList}
        ItemSeparatorComponent={() => (
          <View style={selectedPropertyMemberStyles.memberSeparator} />
        )}
        ListEmptyComponent={
          <EmptyList
            title="Miembros nos encontrados"
            description="Asegurate de invitar o añadir miembros a tu propiedad!"
          />
        }
      />
    </View>
  );
}

const selectedPropertyMemberStyles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 24,
  },
  propertyMemberList: {
    paddingBottom: 20,
  },
  memberSeparator: {
    height: 10,
  },
});

interface GenerateContractDraftProps {
  propertyId: string;
  propertyName: string;
  propertyMemberId: string; //id del miembro que será arrendador en el inmueble
}

export function GenerateContractDraft({
  propertyId,
  propertyName,
  propertyMemberId,
}: GenerateContractDraftProps) {
  //informacion de sesion del actual usuario
  const { user } = useMe();

  //useRef para permitir que react native tenga acceso a la instancia del richEditor
  const richText = useRef<RichEditor>(null);

  //estado para obtener el content del borrador del contrato
  const [content, setContent] = useState<string>("");

  //este metodo nos permite obtener al miembro seleccionado
  const [selectedMember, setSelectedMember] =
    useState<GetAllPropertyMemberInfo | null>(null);

  //mutation para enviar el borrador del contrato al servidor
  const mutation = useMutation({
    mutationKey: ["contractDraft", propertyId],
    mutationFn: (body: CreateContractDraftType) => CreateContractDraft(body),
  });

  const handleContractDraftCreation = async () => {
    //primero extraemos el contenido del html para contruir
    //la respuesta y enviarla al servidor
    const data = ExtractContractInformationOfHTML(content);

    if (!data) return;

    const req = {
      content,
      depositAmount: data.depositAmount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      landlordMemberId: propertyMemberId,
      tenantMemberId: selectedMember!.id,
      propertyId,
      monthlyRent: data.monthlyRent,
    };

    console.log(req);

    await mutation.mutateAsync(req);
  };

  return (
    <View style={generateContractStyles.container}>
      {selectedMember === null && (
        <SelectedPropertyMemberForContractDraft
          propertyId={propertyId}
          setPropertyMember={setSelectedMember}
        />
      )}

      {/**selecccion de miembro */}
      {selectedMember && (
        //usamos el text editor para renderizar el html con la informacion editable
        // y no editable
        <>
          <View style={generateContractStyles.editorStyle}>
            <RichEditor
              ref={richText}
              initialContentHTML={INITIAL_CONTRACT_DRAFT({
                propertyName,
                landlord: {
                  name: user!.fullname,
                  identificationNumber: user!.identificationNumber,
                  identificationType: user!.identificationType,
                },
                tenant: {
                  name: selectedMember.fullname,
                  identificationNumber: selectedMember.identificationNumber,
                  identificationType: selectedMember.identificationType,
                },
                monthlyRent: 100000,
                depositAmount: 500000,
                startDate: new Date(),
                endDate: new Date(),
              })}
              onChange={setContent}
            />
          </View>

          {/**seccion de botones, uno para crear el draft y otro para ir hacia atras y escoger otro miembro */}
          <View style={generateContractStyles.buttonContainer}>
            <ButtonForm
              title="Crear borrador"
              action={handleContractDraftCreation}
            />
          </View>
        </>
      )}
    </View>
  );
}

const generateContractStyles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },

  editorStyle: {
    height: 500,
    marginHorizontal: 12,
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    overflow: "hidden",
  },

  buttonContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 6,
    marginBottom: -12,
  },
});
