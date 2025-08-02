import app from "../src/app.js";
import request  from "supertest";


describe("Testes de autenticação", () => {
    test("Deve permitir login com credenciais válidas", async () => { 
        const res = await request(app)
        .post("/api/usuarios/login")
        .send({ email: "rafael@email.com", senha: "loucodelindo" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    })

    test("Deve retornar erro ao tentar login com credenciais inválidas", async () => { 
        const res = await request(app)
        .post("/api/usuarios/login")
        .send({ email: "rafael@email.com", senha: "senhaerrada" });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Email ou senha inválidas");
    })
})

describe("Rota protegida", () => {
    let token;
    
    beforeAll(async () => {
        const res = await request(app)
            .post("/api/usuarios/login")
            .send({ email: "rafael@email.com",
            senha: "loucodelindo" });

        token = res.body.accessToken;
    })

    test("Deve acessar rota protegida com token válido", async () => {
        const res = await request(app)
            .get("/api/usuarios")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    })

    test("Deve retornar erro ao acessar rota protegida sem token", async () => {
        const res = await request(app)
            .get("/api/usuarios")
            .set("Authorization", "token inválido");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Token inválido");
    })
})