// FEATURE AUTH - Logica de negocio

// Testear la validacion de campos no validos (Telefonos, espacios, formatos incorrectos, direcciones,etc)
import { describe, expect, test } from "vitest";
import type { RegisterType } from "../../../core/schemas/auth-schema";
import { validateContentData } from "../services/auth.service";

//validamos que la limpieza de los datos sea la correcta
test("Deberia de entregar un formulario valido", () => {
    //Casos de uso para los test

    const registerDataExpected: RegisterType = {
        cellphone: "123456789",
        email: "diazpachecobrayan@gmail.com",
        username: "br7forlife",
        password: "123456",
        fullname: "bryandiazpacheco",
        identificationNumber: "29381023841244234",
        identificationType: "CC",
    };

    const result = validateContentData(registerDataExpected);

    expect(result.contentResult).toEqual(registerDataExpected);
});

//validamos que realmente notifique si los datos que se envian no cumplen con las reglas esperadas
describe("Deberia retornar un error de regex en distintos campos", () => {
    const emailRegexError: RegisterType = {
        cellphone: "123456789",
        email: "diazp  achecob rayan @ gmail.com", // <-- debe de fallar si el correo no es valido
        username: "br7forlife",
        password: "123456",
        fullname: "bryandiazpacheco",
        identificationNumber: "29381023841244234",
        identificationType: "CC",
    };

    const cellphoneAndIdentificationNumberRegexError: RegisterType = {
        cellphone: "1234 56 789",
        email: "diazpachecobrayan@gmail.com",
        username: "br7forlife",
        password: "123456",
        fullname: "bryandiazpacheco",
        identificationNumber: "29 3 81 0 2 3841244234",
        identificationType: "CC",
    };

    const emailResult = validateContentData(emailRegexError);
    const cellphoneAndIDResult = validateContentData(
        cellphoneAndIdentificationNumberRegexError,
    );

    // test cuando el email no tiene el resultados esperado
    test("El email no cumple con el formato regex", () => {
        expect(emailResult.invalidFields).toEqual(["EMAIL"]);
    });

    // test cuando el numero de identificacion o telefono no cumplen
    test("El numero de identificacion o el telefono no cumplen con el formato regex", () => {
        expect(cellphoneAndIDResult.invalidFields).toEqual([
            "CELLPHONE",
            "IDENTIFICATION_NUMBER",
        ]);
    });
});

//validamos la funcion entregue los campos vacios si los datos no estan completamente rellenados
test("Deberia enviar los campos por falta de rellenar", () => {
    const userDataEmptyFields: RegisterType = {
        cellphone: "",
        email: "diazpachecobrayan@gmail.com",
        username: "br7forlife",
        password: "123456",
        fullname: "bryandiazpacheco",
        identificationNumber: "29381023841244234",
        identificationType: "CC",
    };

    const result = validateContentData(userDataEmptyFields);

    expect(result.emptyFields).toEqual(["cellphone"]);
});
