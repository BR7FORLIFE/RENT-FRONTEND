import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { EmptyList } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { Palette } from "../../../../themes/themes";
import type { PaginationParams } from "../../../../types/global";
import { GetAllPropertyMembers } from "../../../property-registration/api";
import type { GetAllPropertyMemberInfo } from "../../../property-registration/api.response";
import { PropertyMemberCard } from "../../../property-registration/components/property-members/property-member-card";
import type { StatusPropertyMemberType } from "../../../property-registration/schemas/property-registration.schema";

//rich text editor
import { router } from "expo-router";
import { RichEditor } from "react-native-pell-rich-editor";
import { queryClient } from "../../../../core/configs/tanstackconfig";
import { useMe } from "../../../../stores/auth-store";
import { CreateContractDraft } from "../../api";
import type { CreateContractDraftType } from "../../schemas/contract.schema";
import
  {
    ExtractContractInformationOfHTML,
    INITIAL_CONTRACT_DRAFT,
  } from "../../services/helper";

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
      <FlatList
        ListHeaderComponent={
          <View style={selectedPropertyMemberStyles.header}>
            <Text style={selectedPropertyMemberStyles.title}>
              Elige al arrendatario
            </Text>
            <Text style={selectedPropertyMemberStyles.description}>
              Escoge a la persona a la cual se le generará el borrador de
              contrato.
            </Text>
          </View>
        }
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
            title="Miembros no encontrados"
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
    paddingHorizontal: 20,
  },
  header: {
    gap: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },
  propertyMemberList: {
    flexGrow: 1,
    paddingBottom: 32,
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

    await mutation.mutateAsync({
      content,
      depositAmount: data.depositAmount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      landlordMemberId: propertyMemberId,
      tenantMemberId: selectedMember!.id,
      propertyId,
      monthlyRent: data.monthlyRent,
    });

    //invalidamos la cache para que refleje todos los borradores de contratos
    queryClient.invalidateQueries({
      queryKey: ["GetAllContractDraft", propertyId],
    });

    router.push({ pathname: "/contracts/[id]", params: { id: propertyId } });
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
              variant="primary"
              isPending={mutation.isPending}
              action={handleContractDraftCreation}
            />
            <ButtonForm
              title="Elegir otro miembro"
              action={() => setSelectedMember(null)}
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
    flex: 1,
    minHeight: 320,
    marginHorizontal: 20,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
    overflow: "hidden",
  },

  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
});
