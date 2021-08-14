import { Injectable } from '@angular/core';
import SecureLS from 'secure-ls';

enum LocalStorageItem {
  Role = 'role',
  Email = 'email',
  Token = 'token',
  Validated = 'validated',
  Id = 'id',
  Dni = 'dni',
  Nombre = 'nombre',
  Apellidos = 'apellidos',
  Phone = 'Phone',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  secureLocalStorage: any;

  constructor() {
    this.secureLocalStorage = new SecureLS({
      encodingType: 'aes',
      isCompression: false,
    });
  }

  setRoleLocalStorage(role: string): void {
    this.secureLocalStorage.set(LocalStorageItem.Role, role);
    // localStorage.setItem(LocalStorageItem.Role, role);
  }

  getRoleLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Role);
    return this.secureLocalStorage.get(LocalStorageItem.Role);
  }

  removeRoleFromLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Role);
    this.secureLocalStorage.remove(LocalStorageItem.Role);
  }

  setEmailLocalStorage(email: string): void {
    // localStorage.setItem(LocalStorageItem.Email, email);
    this.secureLocalStorage.set(LocalStorageItem.Email, email);
  }

  getEmailLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Email);
    return this.secureLocalStorage.get(LocalStorageItem.Email);
  }

  removeEmailLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Email);
    this.secureLocalStorage.remove(LocalStorageItem.Email);
  }

  setTokenLocalStorage(token: string): void {
    // localStorage.setItem(LocalStorageItem.Token, token);
    this.secureLocalStorage.set(LocalStorageItem.Token, token);
  }

  getTokenLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Token);
    return this.secureLocalStorage.get(LocalStorageItem.Token);
  }

  removeTokenLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Token);
    this.secureLocalStorage.remove(LocalStorageItem.Token);
  }

  setValidatedLocalStorage(validated: string): void {
    // localStorage.setItem(LocalStorageItem.Validated, validated);
    this.secureLocalStorage.set(LocalStorageItem.Validated, validated);
  }

  getValidatedLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Validated);
    return this.secureLocalStorage.get(LocalStorageItem.Validated);
  }

  removeValidatedLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Validated);
    this.secureLocalStorage.remove(LocalStorageItem.Validated);
  }

  isLoggedIn(): boolean {
    return this.getEmailLocalStorage() != null;
  }

  isValidated(): boolean {
    return this.getValidatedLocalStorage() == 'true';
  }

  setIdLocalStorage(id: number): void {
    // localStorage.setItem(LocalStorageItem.Id, id.toString());
    this.secureLocalStorage.set(LocalStorageItem.Id, id.toString());
  }

  getIdLocalStorage(): number | null {
    // return Number(localStorage.getItem(LocalStorageItem.Id));
    return +this.secureLocalStorage.get(LocalStorageItem.Id);
  }

  removeIdLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Id);
    this.secureLocalStorage.remove(LocalStorageItem.Id);
  }

  setDniLocalStorage(dni: string): void {
    // localStorage.setItem(LocalStorageItem.Dni, dni);
    this.secureLocalStorage.set(LocalStorageItem.Dni, dni);
  }

  setNombreLocalStorage(nombre: string): void {
    // localStorage.setItem(LocalStorageItem.Nombre, nombre);
    this.secureLocalStorage.set(LocalStorageItem.Nombre, nombre);
  }

  setApellidosLocalStorage(apellidos: string): void {
    // localStorage.setItem(LocalStorageItem.Apellidos, apellidos);
    this.secureLocalStorage.set(LocalStorageItem.Apellidos, apellidos);
  }

  getDniLocalStorage(): string | null {
    return this.secureLocalStorage.get(LocalStorageItem.Dni);
    // return localStorage.getItem(LocalStorageItem.Dni);
  }

  getNombreLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Nombre);
    return this.secureLocalStorage.get(LocalStorageItem.Nombre);
  }

  getApellidosLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Apellidos);
    return this.secureLocalStorage.get(LocalStorageItem.Apellidos);
  }

  removeDniLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Dni);
    this.secureLocalStorage.remove(LocalStorageItem.Dni);
  }

  removeNombreLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Nombre);
    this.secureLocalStorage.remove(LocalStorageItem.Nombre);
  }

  removeApellidosLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Apellidos);
    this.secureLocalStorage.remove(LocalStorageItem.Apellidos);
  }

  getPhoneLocalStorage(): string | null {
    // return localStorage.getItem(LocalStorageItem.Phone);
    return this.secureLocalStorage.get(LocalStorageItem.Phone);
  }

  setPhoneLocalStorage(phone: string): void {
    // localStorage.setItem(LocalStorageItem.Phone, phone);
    this.secureLocalStorage.set(LocalStorageItem.Phone, phone);
  }

  removePhoneLocalStorage(): void {
    // localStorage.removeItem(LocalStorageItem.Phone);
    this.secureLocalStorage.remove(LocalStorageItem.Phone);
  }
}
