export class ShowListResponseModel {
    items: ShowItemModel[] | undefined;
    totalItems: number | undefined;
}

class ShowItemModel {
    name: string | undefined;
    sessions: SessionItemModel[] | undefined;
}

class SessionItemModel {
    id: string | undefined;
    freeSeats: number | undefined;
    from: string | undefined;
    to: string | undefined;
}