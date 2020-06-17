export class ShowListModel {
    name: string | undefined;
    sessions: SessionListItemModel[] | undefined;
}

export class SessionListItemModel {
    id: string | undefined;
    freeSeats: number | undefined;
    from: string | undefined;
    to: string | undefined;
}