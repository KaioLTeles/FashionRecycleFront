import { API } from "./config";

const BuscarMargemPadrao = async function () {
  return API.get("/payment/getMargin");
};

const BuscarTodosPagamentoAtivos = async function (payload) {
  return API.get("/payment/getListPaymentsAll", {
    params: {
      inicialDate: payload.inicialDate,
      finalDate: payload.finalDate,
    },
  });
};

const BuscarPagamentoPorId = async function (payload) {
  return API.get("/payment/getPaymentById", {
    params: {
      idPayment: payload.idPayment,
    },
  });
};

const CriarOuAlterarPagamento = async function (payload) {
  return API.post("/payment/alterOrCreatePayment", {
    id: payload.id,
    name: payload.name,
    idPaymentType: payload.idPaymentType,
    amount: payload.amount,
    paymentDate: payload.paymentDate,
    paymentMade: payload.paymentMade,
  });
};

const RemoverPagamentos = async function (payload) {
  return API.delete("/payment/removePayment/" + payload);
};

export const PagamentosApi = {
  BuscarMargemPadrao,
  BuscarTodosPagamentoAtivos,
  BuscarPagamentoPorId,
  CriarOuAlterarPagamento,
  RemoverPagamentos,
};
