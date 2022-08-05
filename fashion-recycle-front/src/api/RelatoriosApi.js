import { API } from "./config";

const BuscarRelatorioVendas = async function (payload) {
  return API.post("/reports/getReportSales", {
    idSale: payload.idSale,
    idClient: payload.idClient,
    idPartner: payload.idPartner,
    brand: payload.brand,
    inicialFilterDate: payload.inicialFilterDate,
    finalFilterDate: payload.finalFilterDate,
  });
};

const BuscarRelatorioPagamentos = async function (payload) {
  return API.get("/reports/getReportPayments", {
    params: {
      inicialDate: payload.inicialDate,
      finalDate: payload.finalDate,
      idPaymentType: payload.idPaymentType,
      filtertype: payload.filtertype,
    },
  });
};

const GetAllSalesForCashFlow = async function (payload) {
  return API.get("/reports/getAllSalesForCashFlow", {
    params: {
      inicialDate: payload.inicialDate,
      finalDate: payload.finalDate,
      onlyRevenue: payload.onlyRevenue,
      onlyExpense: payload.onlyExpense,
    },
  });
};

export const RelatoriosApi = {
  BuscarRelatorioVendas,
  BuscarRelatorioPagamentos,
  GetAllSalesForCashFlow
};
