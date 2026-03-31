import type { Contract, Customer } from '../types';

export interface ActiveRoomOccupant {
    contract: Contract;
    customer: Customer;
}

function toTimestamp(value?: string): number {
    if (!value) return 0;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getActiveContractsForRoom(roomId: string, contracts: Contract[]): Contract[] {
    return contracts
        .filter(contract => contract.roomId === roomId && contract.isActive)
        .sort((left, right) => {
            const byDate = toTimestamp(right.startDate) - toTimestamp(left.startDate);
            return byDate !== 0 ? byDate : right.id.localeCompare(left.id);
        });
}

export function getRoomOccupants(roomId: string, contracts: Contract[], customers: Customer[]): ActiveRoomOccupant[] {
    const customerMap = new Map(customers.map(customer => [customer.id, customer]));

    return getActiveContractsForRoom(roomId, contracts)
        .map(contract => {
            const customer = customerMap.get(contract.customerId);
            return customer ? { contract, customer } : null;
        })
        .filter((occupant): occupant is ActiveRoomOccupant => occupant !== null);
}

export function getRoomOccupancyCount(roomId: string, contracts: Contract[]): number {
    return getActiveContractsForRoom(roomId, contracts).length;
}
