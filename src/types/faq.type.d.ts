type FaqRole = "user" | "snapper";

interface IFaq {
    _id: string;
    question: string;
    answer: string;
    role: FaqRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ICreateFaqPayload {
    question: string;
    answer: string;
    role: FaqRole;
    isActive?: boolean;
}
