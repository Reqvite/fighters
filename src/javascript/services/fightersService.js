import { callApi } from '../helpers/apiHelper';

class FighterService {
  #endpoint = 'fighters.json';
  #detailsEndpoint = 'details/fighter/';
  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    try {
      const detailsEndpoint = `${this.#detailsEndpoint}${id}.json`;
      const fighterDetails = await callApi(detailsEndpoint);
      return fighterDetails;
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
