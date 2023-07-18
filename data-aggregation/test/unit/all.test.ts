import once, { generateRandomUrl } from "../../app/utils/utils";
import { getConfig } from './../../app/config/openapi';
import { oas } from 'koa-oas3';
import EventController from '../../app/controllers/event.controller'; // Update with actual path to your EventController class
import { Status } from "../../app/types/types";

describe('Unit test', () => {

    let eventController: EventController;

    beforeAll(() => {
        eventController = new EventController();
    });

    it('Should return a valid randon url', async () => {
        let url = generateRandomUrl()
        let url2 = generateRandomUrl()
        expect(url).not.toEqual(url2)
    });

    it('should only call the function once', () => {
        const mockFn = jest.fn((x: number) => x * 2);
        const onceFn = once(mockFn);

        const firstResult = onceFn(2);
        expect(firstResult).toBe(4);
        expect(mockFn).toHaveBeenCalledTimes(1);

        const secondResult = onceFn(3);
        expect(secondResult).toBe(4); // still the result from the first call
        expect(mockFn).toHaveBeenCalledTimes(1); // function was not called again
    });

    describe('inferActionFromPath', () => {
        it('should infer "deployment creation" when path includes "/deployment" but not "/webhook"', () => {
            const path = '/deployment';
            const bodyParams = {};
            expect(eventController.inferActionFromPath(path, bodyParams)).toBe('deployment creation');
        });

        it('should infer "deployment canceled" when path includes "/deployment/cancel"', () => {
            const path = '/deployment/cancel';
            const bodyParams = {};
            expect(eventController.inferActionFromPath(path, bodyParams)).toBe('deployment canceled');
        });

        it('should infer "deployment {status}" when path includes "/webhook"', () => {
            const path = '/webhook';
            const bodyParams: { status: Status } = { status: 'done' };
            expect(eventController.inferActionFromPath(path, bodyParams)).toBe('deployment done');
        });

        it('should infer "unknown action" for unknown paths', () => {
            const path = '/unknown/path';
            const bodyParams = {};
            expect(eventController.inferActionFromPath(path, bodyParams)).toBe('unknown action');
        });
    });

    describe('extractIdFromPath', () => {
        it('should extract ID from a path', () => {
            const path = '/path/123';
            expect(eventController.extractIdFromPath(path)).toBe('123');
        });

        it('should return null when no ID is present in the path', () => {
            const path = '/path/no-id';
            expect(eventController.extractIdFromPath(path)).toBeNull();
        });
    });


});

