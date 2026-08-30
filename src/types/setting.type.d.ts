type SettingDocumentKey = "privacy_policy" | "term_condition" | "about_us";
type SettingDocumentRole = "user" | "snapper";

interface ISettingDocument {
    _id?: string;
    key: SettingDocumentKey;
    role: SettingDocumentRole;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IUpdateSettingPayload {
    key: SettingDocumentKey;
    role: SettingDocumentRole;
    content: string;
}
