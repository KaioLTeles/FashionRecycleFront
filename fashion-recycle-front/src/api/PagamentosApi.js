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
    recurringPayment: payload.recurringPayment
  });
};

const RemoverPagamentos = async function (payload) {
  return API.delete("/payment/removePayment/" + payload);
};


//RECEBIMENTO
const BuscarTodosRecebimentos = async function (payload) {
  return API.get("/Recievables/getListReceiablesAll", {
    params: {
      inicialDate: payload.inicialDate,
      finalDate: payload.finalDate,
      idClient: payload.idClient
    },
  });
};

const AlterarRecebimento = async function (payload) {
  return API.post("/Recievables/updateReceievalbe/"+ payload);
};

export const PagamentosApi = {
  BuscarMargemPadrao,
  BuscarTodosPagamentoAtivos,
  BuscarPagamentoPorId,
  CriarOuAlterarPagamento,
  RemoverPagamentos,
  BuscarTodosRecebimentos,
  AlterarRecebimento
};
