import { api } from "../../core/api/axios-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { GetAll } from "../../types/global";
import type {
    ContractDraftInfoResponse,
    ContractInfoResponse,
} from "./api.response";
import type {
    AcceptedOrRejectedContractType,
    CreateContractDraftType,
    CreateContractType,
    LoadContractDocumentType,
} from "./schemas/contract.schema";

export async function CreateContract(contract: CreateContractType) {
    const { data } = await api.post<{ id: string; message: string }>(
        `${FINANCIAL_MODULE}/contract`,
        contract,
    );
    return data;
}

export async function GetContractById(contractId: string, propertyId: string) {
    const { data } = await api.get<ContractInfoResponse>(
        `${FINANCIAL_MODULE}/contract/${contractId}/property/${propertyId}`,
    );
    return data;
}

export async function GetAllContracts(
    propertyId: string,
    page: number,
    limit: number,
) {
    const { data } = await api.get<GetAll<ContractInfoResponse[]>>(
        `${FINANCIAL_MODULE}/contract/property/${propertyId}`,
        { params: { page, limit } },
    );
    return data;
}

export async function AcceptedOrRejectedContract(
    body: AcceptedOrRejectedContractType,
) {
    const { data } = await api.post<{ contractId: string; message: string }>(
        `${FINANCIAL_MODULE}/contract/acceptedOrRejected`,
        body,
    );
    return data;
}

export async function LoadContractDocuments(
    contractId: string,
    body: LoadContractDocumentType,
) {
    const { data } = await api.post<{ contractId: string; message: string }>(
        `${FINANCIAL_MODULE}/contract/${contractId}/documents`,
        body,
    );
    return data;
}

export async function ChangeContractStatus(
    contractId: string,
    propertyId: string,
    status: "SUSPENDED" | "FINISHED",
) {
    const { data } = await api.post<{ contractId: string; message: string }>(
        `${FINANCIAL_MODULE}/contract/${contractId}/property/${propertyId}/status`,
        { status },
    );
    return data;
}

//draft
export async function CreateContractDraft(body: CreateContractDraftType) {
    const { data } = await api.post<{
        id: string;
        version: number;
        message: string;
        createAt: string;
    }>(`${FINANCIAL_MODULE}/contract/draft`, body);

    return data;
}

export async function GetAllContractDraft(
    propertyId: string,
    page: number,
    limit: number,
) {
    const { data } = await api.get<GetAll<ContractDraftInfoResponse[]>>(
        `${FINANCIAL_MODULE}/contract/draft/property/${propertyId}/getall`,
        { params: { page, limit } },
    );
    return data;
}

export async function GetContractDraftById(
    contractDraftId: string,
    propertyId: string,
) {
    const { data } = await api.get<ContractDraftInfoResponse>(
        `${FINANCIAL_MODULE}/contract/draft/${contractDraftId}/property/${propertyId}`,
    );
    return data;
}

export async function AgreeContractDraft(
    contractDraftId: string,
    propertyId: string,
) {
    const { data } = await api.post<{
        contractDraftId: string;
        message: string;
    }>(`${FINANCIAL_MODULE}/contract/draft/${contractDraftId}/agree`, {
        propertyId,
    });
    return data;
}
