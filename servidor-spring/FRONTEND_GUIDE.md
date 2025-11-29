## Frontend Implementation Guide: Fetching Musician Contracts

This guide provides instructions for frontend developers on how to consume the new API endpoint to fetch a list of contracts for an authenticated musician. This is intended to replace the current mock data on the `/Musico/Home` page.

### 1. Objective

To display a list of all contracts associated with the currently authenticated musician, allowing them to track their upcoming and completed work.

### 2. API Endpoint Details

-   **Endpoint**: `GET /v1/contratos`
-   **Method**: `GET`
-   **Authentication**: Required. The request must include a valid JSON Web Token (JWT) from an authenticated musician. The ID of the authenticated musician (from the token) must match the `musicoId` sent in the query parameter.

### 3. Request Details

-   **Query Parameter**:
    -   `musicoId`: The unique ID of the musician whose contracts you want to fetch. This **must** be the ID of the authenticated musician.
-   **Headers**:
    -   `Authorization`: Your JWT Bearer token (`Bearer <your_jwt_token>`).

### 4. Frontend Integration Steps

You should integrate this API call within the `useEffect` hook of your `Musico/Home/page.tsx` component to fetch data dynamically.

#### Step 1: Get Musician ID and Token

Retrieve the musician's `id` and `token` from `localStorage`. Ensure you handle cases where these might be missing (e.g., redirect to login).

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Assuming you're using Next.js router

// ... inside your component

const router = useRouter(); // Initialize useRouter if using Next.js

useEffect(() => {
    const id = localStorage.getItem('soundbridge/id');
    const token = localStorage.getItem('soundbridge/token');

    if (!id || !token) {
        // Handle user not logged in, e.g., redirect to login
        console.error("Musician ID or token not found in localStorage. Redirecting to login.");
        router.push('/Login'); // Adjust path as necessary
        return;
    }

    // Proceed with fetching data
    fetchContracts(id, token);
}, []); // Empty dependency array means this runs once on component mount
```

#### Step 2: Fetch Data using `fetch` API

Make an asynchronous `fetch` call to the API endpoint.

```typescript
// ... inside your component or as a helper function

const fetchContracts = async (musicianId: string, authToken: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/v1/contratos?musicoId=${musicianId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            // Handle HTTP errors (e.g., 400, 401, 403, 404, 500)
            const errorData = await response.json(); // Attempt to parse error message from body
            throw new Error(errorData.message || `Failed to fetch contracts: ${response.status} ${response.statusText}`);
        }

        const fetchedContratos = await response.json();
        console.log("Fetched contracts:", fetchedContratos);

        // Call mapping function here
        mapAndSetContracts(fetchedContratos, musicianId);

    } catch (error) {
        console.error("Error fetching contracts:", error);
        // Display user-friendly error message on the UI
    }
};
```

#### Step 3: Map API Response to Frontend State

The API response (`List<ContratoResponseDTO>`) has a structured format. You will need to map this data to your frontend's `Contrato` interface (or whatever type you are using for your state).

```typescript
// ... inside your component

// Assuming your frontend state looks something like this:
// interface FrontendContrato {
//     id: string;
//     musicoId: string;
//     contratanteId: string;
//     nomeMusico: string;
//     nomeContratante: string;
//     localApresentacao: string;
//     dataPagamento: string | null; // or Date object
//     dataServico: string; // or Date object
//     contratoAtivo: boolean;
//     valorContrato: number;
//     horasDuracao: number;
//     comprovantePagamento: string | null;
// }
// const [contratos, setContratos] = useState<FrontendContrato[]>([]);

const mapAndSetContracts = (fetchedContratos: any[], musicianId: string) => {
    const nomeMusico = localStorage.getItem('soundbridge/nome') || 'Músico'; // Assuming musician's name is in localStorage

    const contratosFormatados = fetchedContratos.map(contrato => ({
        id: contrato.id,
        musicoId: musicianId, // Use the ID from localStorage/param
        contratanteId: contrato.contratante.id,
        nomeMusico: nomeMusico,
        nomeContratante: contrato.contratante.nome,
        localApresentacao: contrato.localEvento,
        dataPagamento: contrato.dataPagamento, // API returns LocalDateTime, adjust formatting if needed
        dataServico: contrato.dataEvento,     // API returns LocalDateTime, adjust formatting if needed
        contratoAtivo: contrato.status === 'CONFIRMADO', // Map string status to boolean
        valorContrato: contrato.valorTotal,
        horasDuracao: contrato.duracao,
        comprovantePagamento: contrato.comprovantePagamentoUrl,
    }));

    setContratos(contratosFormatados);
};
```

### 5. Error Handling

Be prepared to handle various HTTP status codes and display appropriate messages to the user:

-   **`400 Bad Request`**: Indicates issues with the `musicoId` query parameter (e.g., missing).
-   **`401 Unauthorized`**: Occurs if the `Authorization` header is missing or the JWT is invalid/expired. The frontend should redirect to the login page.
-   **`403 Forbidden`**: This happens if the authenticated user's ID does not match the `musicoId` in the query parameter, or if the user is not a `MUSICO`. Ensure the `musicoId` passed in the query matches the ID from the authenticated user's token.

By following these steps, your frontend can successfully integrate with the new backend API to display musician contracts.
