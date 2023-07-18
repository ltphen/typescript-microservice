import { generateRandomUrl } from "../../app/utils/utils";
import { getConfig } from './../../app/config/openapi';
import { oas } from 'koa-oas3';

describe('Unit test', () => {

    it('Should return a valid randon url', async () => {
        let url = generateRandomUrl()
        let url2 = generateRandomUrl()
        expect(url).not.toEqual(url2)
    });

});

