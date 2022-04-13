"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const JUtil_1 = require("./util/JUtil");
const PessoaFisica_1 = require("./objects/PessoaFisica");
const PessoaFisicaTransaction_1 = require("./model/PessoaFisicaTransaction");
const util = JUtil_1.JUtil;
let win;
let transaction;
app.whenReady().then(() => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile("src/view/index.html");
    win.maximize();
});
ipcMain.on('pessoa:add', (e, item) => __awaiter(void 0, void 0, void 0, function* () {
    const pessoa = new PessoaFisica_1.PessoaFisica(item.id, item.nome, item.email, item.senha, item.telefone, (item.sys_auth == 'true' ? 1 : 2));
    transaction = new PessoaFisicaTransaction_1.PessoaFisicaTransaction();
    yield transaction.store(pessoa).then((res) => {
        win.webContents.send('pessoa:add:success', res);
    });
}));
ipcMain.on('load:lista:pessoas', () => __awaiter(void 0, void 0, void 0, function* () {
    transaction = new PessoaFisicaTransaction_1.PessoaFisicaTransaction();
    yield transaction.getAll().then((res) => {
        win.webContents.send('load:lista:pessoas:success', res);
    });
}));
ipcMain.on('edit:list:pessoas', (err, res) => __awaiter(void 0, void 0, void 0, function* () {
    transaction = new PessoaFisicaTransaction_1.PessoaFisicaTransaction();
    yield transaction.get(res).then((res) => {
        win.webContents.send('edit:pessoa', res);
    });
}));
