import { Router, Request, Response } from 'express';
import { loadAllTickets, loadTicketsByUserID, loadTicketByID, saveTicket } from '../database';
import { Ticket } from '../models/ticket';
import { generateQRcode } from '../utils/qr_generator';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send("All is good here!");
});

router.get('/getTickets', async (req: Request, res: Response) => {
    let tickets: Ticket[] = await loadAllTickets();
    res.json({
        data: tickets
    });
});

router.get('/getTickets/:userID', async (req: Request, res: Response) => {
    let userID: string = req.params.userID;
    let tickets: Ticket[] = await loadTicketsByUserID(userID);
    res.json({
        data: tickets
    });
});

router.get('/getTickets/ticket/:ticketID', async (req: Request, res: Response) => {
    let ticketID: string = req.params.ticketID;
    let ticket: Ticket = await loadTicketByID(ticketID);
    res.json({
        data: ticket
    });
});

router.post('/createTicket', async (req: Request, res: Response) => {
    let ticket: Ticket = req.body;
    let baseUrl = "http://localhost:3050";
    if(!(ticket.vatin && ticket.firstName && ticket.lastName)) {
        res.status(400).send("Incomplete information");
    } else {
        var tickets = await loadTicketsByUserID(ticket!.vatin);
        if(tickets && tickets.length >= 3) {
            res.status(400).send("Max amount of tickets reached");
        } else {
            ticket = await saveTicket(ticket!);
            let qrCode = await generateQRcode(baseUrl, ticket!.ticketId!);
            res.json({
                data: qrCode
            });
        }
    }
});

export default router;
