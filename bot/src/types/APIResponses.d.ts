declare interface BankCharacter {
    // GUID for this bank character.
    id: string;

    // Name of this bank character.
    name: string;

    // ISO-formatted date of when this bank was last updated.
    lastUpdated: string;

    // The gold on this bank, in copper.
    gold: number;

    //The GUID for the guild this bank belongs to.
    guildId: string;

    // An array of this bank's bags.
    bags: BankBag[]
}

declare interface BankBag {
    // GUID of this bank bag.
    id: string;

    // GUID of the bank character this bag belongs to.
    characterId: string;

    // The slots of this bag.
    bagSlots: BagSlot[]
}

declare interface BagSlot {
    // The index of the bag this slot is in.
    slotId: number;

    // The number of items in this slot.
    quantity: number;

    // The GUID of the bag this slot belongs to.
    bagId: number;

    // The item in this slot.
    item: BankItem;
}

declare interface BankItem {
    // The ingame id of this item.
    id: number;

    // The name of this item.
    name: string;

    // The string id of the item this item uses.
    icon: string;

    // The ingame quality of this item.
    quality: string;
}
