import { toDataURL } from "qrcode";

export async function generateQRcode(baseUrl: string, ticketID: string) {
    let qrCode = baseUrl + "/tickets/" + ticketID;
    console.log(qrCode);
    return await toDataURL(qrCode);
}