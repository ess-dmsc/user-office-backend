import User from "../models/User";
import Role from "../models/Role";

export interface UserDataSource {
  // Read
  get(id: number): Promise<User | null>;
  getUserRoles(id: number): Promise<Role[]>;
  getUsers(): Promise<User[]>;
  getRoles(): Promise<Role[]>;
  getProposalUsers(proposalId: number): Promise<User[]>;
  // Write
  create(firstname: string, lastname: string): Promise<User | null>;
  update(user: User): Promise<User | null>;
  addUserRole(userID: number, roleID: number): boolean;
}
