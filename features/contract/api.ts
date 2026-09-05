import { api } from "../../core/api/axios-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { GetAll } from "../../types/global";
import type { ContractInfoResponse } from "./api.response";
import type {
    AcceptedOrRejectedContractType,
    CreateContractType,
    LoadContractDocumentType,
} from "./schemas/contract.schema";

export async function createContract(contract: CreateContractType) {
    const { data } = await api.post<{ id: string; message: string }>(
        `${FINANCIAL_MODULE}/contract`,
        contract,
    );
    return data;
}

export async function getContractById(contractId: string, propertyId: string) {
    const { data } = await api.get<ContractInfoResponse>(
        `${FINANCIAL_MODULE}/contract/${contractId}/property/${propertyId}`,
    );
    return data;
}

export async function getAllContracts(propertyId: string) {
    const { data } = await api.get<GetAll<ContractInfoResponse>>(
        `${FINANCIAL_MODULE}/contract/property/${propertyId}`,
    );
    return data;
}

export async function acceptedOrRejectedContract(
    body: AcceptedOrRejectedContractType,
) {
    const { data } = await api.post<{ contractId: string; message: string }>(
        `${FINANCIAL_MODULE}/contract/acceptedOrRejected`,
        body,
    );
    return data;
}

export async function loadContractDocuments(
    contractId: string,
    body: LoadContractDocumentType,
) {
    const { data } = await api.post<{ contractId: string; message: string }>(
        `${FINANCIAL_MODULE}/contract/${contractId}/documents`,
        body,
    );
    return data;
}
