import supertest from "supertest";
import app from "../src/app";
import { db } from "../src/database/database.connection";

// No início do seu arquivo de teste
jest.setTimeout(10000); // 10 segundos


const request = supertest(app);

beforeAll(async () => {
    await db.query('DELETE FROM PASSENGERS;');
    await db.query('DELETE FROM CITIES;');
    await db.query('DELETE FROM TRAVELS;');
    await db.query('DELETE FROM FLIGHTS;');
    console.log('deleted');
});



describe("/passengers", () => {
    it("given a firstName and LastName it should return 201", async () => {
        const body = {
            firstName: "Joana",
            lastName: "Alves",
        };

        const result = await request
            .post("/passengers")
            .send(body);

        const status = result.status;

        expect(status).toEqual(201);
        console.log(body, status)
    });
});

describe("/cities", () => {
    it("given a name that does not exists it shall return 201", async () => {
        const body = {
            name: "Salvadores"
        };

        const result = await request
            .post("/cities")
            .send(body);

        const status = result.status;

        expect(status).toEqual(201);
        console.log(body, status)
    });
});

describe("/flights", () => {
    it("given a origin and destination that is different from each other and exists on the db it shall return 201", async () => {
        const body =
        {
            origin: 22,
            destination: 23,
            date: "2023-12-24",
        };

        const result = await request
            .post("/flights")
            .send(body);

        const status = result.status;

        expect(status).toEqual(201);
    });
});

describe("/travels", () => {
    it("given a passengerId and a flightId that does exists on the DB it shall return 201", async () => {
        const body =
        {
            passengerId: 1,
            flightId: 1
        }

        const result = await request
            .post("/travels")
            .send(body);

        const status = result.status;

        expect(status).toEqual(201);
    });
});
