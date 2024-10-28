import { toDataURL } from "qrcode";

export async function generateQRcode(baseUrl: string, ticketID: string) {
    let qrCode = baseUrl + ticketID;
    return await toDataURL(qrCode);
}