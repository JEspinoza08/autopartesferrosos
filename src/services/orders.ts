import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

async function getFunctionErrorMessage(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    try {
      const errorBody = await error.context.json();

      console.error("EDGE FUNCTION HTTP ERROR:", errorBody);

      return (
        errorBody?.error ||
        errorBody?.message ||
        errorBody?.culqi?.user_message ||
        errorBody?.culqi?.merchant_message ||
        "La función devolvió un error."
      );
    } catch (parseError) {
      console.error(
        "No se pudo leer la respuesta de la Edge Function:",
        parseError
      );

      return "La función devolvió un error sin un formato válido.";
    }
  }

  if (error instanceof FunctionsFetchError) {
    console.error("EDGE FUNCTION FETCH ERROR:", error);
    return "No se pudo conectar con la Edge Function.";
  }

  if (error instanceof FunctionsRelayError) {
    console.error("EDGE FUNCTION RELAY ERROR:", error);
    return "Supabase no pudo procesar la solicitud.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        order_items(*),
        payments(*),
        order_status_history(*)
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ERROR GET MY ORDERS:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createNonCardOrder(
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.functions.invoke(
    "create-order",
    {
      body: payload,
    }
  );

  if (error) {
    const message = await getFunctionErrorMessage(error);
    throw new Error(message);
  }

  if (data?.error) {
    console.error("CREATE ORDER RESPONSE ERROR:", data);
    throw new Error(data.error);
  }

  return data;
}

export async function payWithCulqi(
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.functions.invoke(
    "create-culqi-payment",
    {
      body: payload,
    }
  );

  if (error) {
    const message = await getFunctionErrorMessage(error);
    throw new Error(message);
  }

  if (data?.error) {
    console.error("CULQI PAYMENT RESPONSE ERROR:", data);

    throw new Error(
      data.error ||
        data?.culqi?.user_message ||
        data?.culqi?.merchant_message ||
        "No se pudo completar el pago."
    );
  }

  return data;
}