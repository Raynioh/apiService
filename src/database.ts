import { Pool } from 'pg'
import dotenv from 'dotenv'
import { Ticket } from './models/ticket';

dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'qr_code_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
});

export async function loadTicketsByUserID(userID: string) {
    var tickets: Ticket[] = [];
    const results = await pool.query('SELECT * from Tickets WHERE vatin=\'' + userID + '\'');
    results.rows.forEach(r => {
        tickets.push(mapTicket(r));
    });
    return tickets;
}

export async function loadTicketByID(ticketID: string) {
    const result = await pool.query('SELECT * from Tickets WHERE ticketid=\'' + ticketID + '\'');
    return mapTicket(result.rows[0]);
}

export async function loadAllTickets() {
    var tickets: Ticket[] = [];
    const results = await pool.query('SELECT * from Tickets');
    results.rows.forEach(r => {
        tickets.push(mapTicket(r));
    });
    return tickets;
}

export async function saveTicket(ticket: Ticket) : Promise<Ticket> {
    const result = await pool.query('INSERT INTO Tickets (firstName, lastName, vatin) VALUES (\'' + ticket.firstName + '\', \'' + ticket.lastName + '\', \'' + ticket.vatin + '\') RETURNING *');
    return mapTicket(result.rows[0]);
}

function mapTicket(dbTicket: any) : Ticket{
    let date = new Date(dbTicket.datecreated);
    let formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);

    let ticket: Ticket = {
        ticketId: dbTicket.ticketid,
        dateCreated: formattedDate,
        vatin: dbTicket.vatin,
        lastName: dbTicket.lastname,
        firstName: dbTicket.firstname,
    };
    return ticket;
}