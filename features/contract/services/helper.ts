import Toast from "react-native-toast-message";

interface PersonalInformacion {
    name: string;
    identificationType: "CC" | "CE" | "TI" | "PPT" | "PASSPORT";
    identificationNumber: string;
}

interface Props {
    propertyName: string; //campo no editable
    landlord: PersonalInformacion; // campo no editable
    tenant: PersonalInformacion; // campo no editable
    monthlyRent: number; // campo editable
    depositAmount: number; //campo editable
    startDate: Date; // campo editable
    endDate: Date; //campo editable
}

//esta funcion permite crear una primera platilla para que el usuario pueda editar el contrato a base de
// esta informacion

export const INITIAL_CONTRACT_DRAFT = ({
    propertyName,
    landlord,
    tenant,
    monthlyRent,
    depositAmount,
    startDate,
    endDate,
}: Props) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("es-CO", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO").format(value);
    };

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Contrato de Arrendamiento</title>

  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1E293B;
      background-color: #FFFFFF;
    }

    .document {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .title {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    .subtitle {
      font-size: 13px;
      color: #64748B;
    }

    .section {
      margin-top: 24px;
    }

    .section-title {
      margin-bottom: 10px;
      font-size: 15px;
      font-weight: 700;
      color: #1E293B;
    }

    .paragraph {
      margin: 0 0 12px 0;
      text-align: justify;
    }

    .parties {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    .party {
      flex: 1;
      padding: 16px;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      background-color: #F8FAFC;
    }

    .party-title {
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 700;
      color: #1D4ED8;
    }

    .party-row {
      margin-bottom: 8px;
    }

    .label {
      display: block;
      margin-bottom: 2px;
      font-size: 11px;
      font-weight: 600;
      color: #64748B;
    }

    .locked {
      color: #111827;
    }

    /*
      Campos que RENT controla.
      El usuario no debe poder modificarlos.
    */
    .locked-field {
      color: #111827;
      user-select: none;
    }

    /*
      Campos editables por el usuario.
      El editor puede identificar cada campo
      mediante data-field.
    */
    .editable-field {
      display: inline-block;
      min-width: 90px;
      padding: 1px 5px;
      color: #1D4ED8;
      background-color: #EFF6FF;
      border-bottom: 1px solid #2563EB;
    }

    .property-name {
      font-weight: 600;
    }

    .signature-section {
      display: flex;
      gap: 48px;
      margin-top: 64px;
    }

    .signature {
      flex: 1;
      text-align: center;
    }

    .signature-line {
      margin-bottom: 8px;
      border-top: 1px solid #334155;
    }

    .signature-name {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .signature-role {
      margin-top: 4px;
      font-size: 12px;
      color: #64748B;
    }

    .preview-bottom-space {
    height: 300px;
    }
  </style>
</head>

<body>
  <div class="document">

    <!-- ENCABEZADO -->

    <div class="header">

      <h1 class="title">
        CONTRATO DE ARRENDAMIENTO
      </h1>

      <div class="subtitle">
        Contrato de arrendamiento de inmueble
      </div>

    </div>


    <!-- PARTES -->

    <div class="section">

      <div class="section-title">
        PARTES DEL CONTRATO
      </div>

      <p class="paragraph">
        Entre los suscritos, por una parte,
        <strong>EL ARRENDADOR</strong>, y por otra parte,
        <strong>EL ARRENDATARIO</strong>, se celebra el presente
        contrato de arrendamiento respecto del inmueble identificado
        como
        <strong>
          <span
            class="locked-field property-name"
            contenteditable="false"
            data-field="propertyName"
          >
            ${propertyName}
          </span>
        </strong>.
      </p>


      <div class="parties">

        <!-- ARRENDADOR -->

        <div class="party">

          <div class="party-title">
            EL ARRENDADOR
          </div>

          <div class="party-row">

            <span class="label">
              Nombre completo
            </span>

            <span
              class="locked-field"
              contenteditable="false"
              data-field="landlord.name"
            >
              ${landlord.name}
            </span>

          </div>


          <div class="party-row">

            <span class="label">
              Documento de identidad
            </span>

            <span
              class="locked-field"
              contenteditable="false"
              data-field="landlord.identification"
            >
              ${landlord.identificationType}
              ${landlord.identificationNumber}
            </span>

          </div>

        </div>


        <!-- ARRENDATARIO -->

        <div class="party">

          <div class="party-title">
            EL ARRENDATARIO
          </div>

          <div class="party-row">

            <span class="label">
              Nombre completo
            </span>

            <span
              class="locked-field"
              contenteditable="false"
              data-field="tenant.name"
            >
              ${tenant.name}
            </span>

          </div>


          <div class="party-row">

            <span class="label">
              Documento de identidad
            </span>

            <span
              class="locked-field"
              contenteditable="false"
              data-field="tenant.identification"
            >
              ${tenant.identificationType}
              ${tenant.identificationNumber}
            </span>

          </div>

        </div>

      </div>

    </div>


    <!-- PRIMERA -->

    <div class="section">

      <div class="section-title">
        PRIMERA — INMUEBLE
      </div>

      <p class="paragraph">
        El presente contrato tiene por objeto el arrendamiento del
        inmueble denominado
        <strong>
          <span
            class="locked-field"
            contenteditable="false"
            data-field="propertyName"
          >
            ${propertyName}
          </span>
        </strong>.
      </p>

    </div>


    <!-- SEGUNDA -->

    <div class="section">

      <div class="section-title">
        SEGUNDA — CANON DE ARRENDAMIENTO
      </div>

      <p class="paragraph">
        EL ARRENDATARIO se obliga a pagar a EL ARRENDADOR, por concepto
        de canon mensual de arrendamiento, la suma de
        <span
          class="editable-field"
          contenteditable="true"
          data-field="renta-mensual"
        >
          $${formatCurrency(monthlyRent)}
        </span>
        pesos colombianos.
      </p>

    </div>


    <!-- TERCERA -->

    <div class="section">

      <div class="section-title">
        TERCERA — DURACIÓN
      </div>

      <p class="paragraph">
        El presente contrato tendrá una duración comprendida entre el
        <span
          class="editable-field"
          contenteditable="true"
          data-field="fecha-comienzo"
        >
          ${formatDate(startDate)}
        </span>
        y el
        <span
          class="editable-field"
          contenteditable="true"
          data-field="fecha-finalizacion"
        >
          ${formatDate(endDate)}
        </span>.
      </p>

    </div>


    <!-- CUARTA -->

    <div class="section">

      <div class="section-title">
        CUARTA — DEPÓSITO
      </div>

      <p class="paragraph">
        EL ARRENDATARIO entregará como depósito inicial de la vivienda
        la suma de
        <span
          class="editable-field"
          contenteditable="true"
          data-field="cantidad-deposito"
        >
          $${formatCurrency(depositAmount)}
        </span>
        pesos colombianos.
      </p>

    </div>


    <!-- QUINTA -->

    <div class="section">

      <div class="section-title">
        QUINTA — OBLIGACIONES
      </div>

      <p class="paragraph">
        EL ARRENDATARIO se compromete a conservar el inmueble en buen
        estado, utilizarlo de acuerdo con su destinación y cumplir
        oportunamente con las obligaciones económicas derivadas del
        presente contrato.
      </p>

      <p class="paragraph">
        EL ARRENDADOR se compromete a garantizar el uso y goce del
        inmueble durante la vigencia del contrato, de acuerdo con las
        condiciones establecidas en el presente documento.
      </p>

    </div>


    <!-- SEXTA -->

    <div class="section">

      <div class="section-title">
        SEXTA — ACEPTACIÓN
      </div>

      <p class="paragraph">
        Las partes manifiestan que han leído el presente contrato y
        aceptan las condiciones establecidas en el mismo.
      </p>

    </div>


    <!-- FIRMAS -->
    <div class="signature-section">

    <div class="signature">
        <div class="signature-line"></div>

        <div
        class="signature-name locked-field"
        contenteditable="false"
        data-field="landlord.name"
        >
        ${landlord.name}
        </div>

        <div class="signature-role">
        EL ARRENDADOR
        </div>
    </div>

    <div class="signature">
        <div class="signature-line"></div>

        <div
        class="signature-name locked-field"
        contenteditable="false"
        data-field="tenant.name"
        >
        ${tenant.name}
        </div>

        <div class="signature-role">
        EL ARRENDATARIO
        </div>
    </div>

    </div>

    <div class="preview-bottom-space"></div>
    </div>
</body>
</html>
`;
};
function extractTextField(html: string, field: string): string {
    const regex = new RegExp(
        `<[^>]*data-field=["']${field}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`,
        "i",
    );

    const match = html.match(regex);

    if (!match) {
        throw new Error(`Campo ${field} no encontrado`);
    }

    return match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
}

function extractNumberField(html: string, field: string): number {
    const value = extractTextField(html, field);

    const cleaned = value.replace(/\$/g, "").replace(/\s/g, "");

    if (!/^\d[\d.,]*$/.test(cleaned)) {
        throw new Error(
            `El campo ${field} contiene un valor numerico invalido: ${value}`,
        );
    }

    const normalized = cleaned.replace(/[.,]/g, "");

    const number = Number(normalized);

    if (!Number.isSafeInteger(number)) {
        throw new Error(
            `El campo ${field} debe contener un numero entero valido`,
        );
    }

    if (number <= 0) {
        throw new Error(`El campo ${field} debe ser mayor que cero`);
    }

    return number;
}

function parseDate(value: string): string {
    const normalized = value.toLowerCase().trim().replace(/\s+/g, " ");

    const months: Record<string, string> = {
        enero: "01",
        febrero: "02",
        marzo: "03",
        abril: "04",
        mayo: "05",
        junio: "06",
        julio: "07",
        agosto: "08",
        septiembre: "09",
        octubre: "10",
        noviembre: "11",
        diciembre: "12",
    };

    const match = normalized.match(/^(\d{1,2}) de ([a-záéíóú]+) de (\d{4})$/);

    if (!match) {
        throw new Error(`Fecha invalida: ${value}`);
    }

    const [, day, monthName, year] = match;

    const month = months[monthName];

    if (!month) {
        throw new Error(`Mes invalido: ${monthName}`);
    }

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
    ) {
        throw new Error(`Fecha invalida: ${value}`);
    }

    return `${year}-${month}-${day}`;
}

interface ContractDraftHTMLInformation {
    monthlyRent: number;
    depositAmount: number;
    startDate: string;
    endDate: string;
}

export function ExtractContractInformationOfHTML(
    html: string,
): ContractDraftHTMLInformation | null {
    try {
        const monthlyRent = extractNumberField(html, "renta-mensual");
        const depositAmount = extractNumberField(html, "cantidad-deposito");

        const startDate = extractTextField(html, "fecha-comienzo");
        const endDate = extractTextField(html, "fecha-finalizacion");

        return {
            monthlyRent,
            depositAmount,
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
        };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error inesperado";

        Toast.show({
            type: "error",
            text2: message,
        });

        return null;
    }
}
