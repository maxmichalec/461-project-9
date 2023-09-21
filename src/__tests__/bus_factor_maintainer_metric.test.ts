// tests/bus_factor_maintainer_metric.test.ts
import logger from '../run'
import { bus_factor_maintainer_metric } from '../bus_factor_maintainer_metric';

import {fetchContributors, calculateBusFactor, calculateResponsiveMaintainer } from '../bus_factor_maintainer_metric';

describe('fetchContributors', () => {
  it('should fetch contributors successfully', async () => {
    // Mock the fetch function to always return a 200 status
    const mockResponseData = [{ login: 'contributor1', contributions: 20 }];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: async () => mockResponseData,
    } as Response);
  
    // Call the function
    const contributors = await fetchContributors('https://example.com/api/contributors');
  
    // Assert that the contributors match the expected data
    expect(contributors).toEqual(mockResponseData);
  });
  
  it('should handle fetch error', async () => {
    // Mocking fetch function to simulate an error
    global.fetch = jest.fn(() => Promise.reject('Network error'));
  
    const contributors = await fetchContributors('https://example.com/api/contributors');
  
    // Assert that contributors is null in case of error
    expect(contributors).toBeNull();
  });
  
});

describe('calculateBusFactor', () => {
  it('should calculate bus factor correctly', () => {
    const contributors = [{ contributions: 20 }, { contributions: 10 }];
  
    const busFactor = calculateBusFactor(contributors);
  
    // Update the expected value and precision as needed
    expect(busFactor).toBeCloseTo(0.1, 1); // Approximately 0.2, rounded to 1 decimal place
  });
});

describe('calculateResponsiveMaintainer', () => {
  it('should calculate responsive maintainer correctly', () => {
    const contributorsPerPage = [{}, {}, {}]; // Simulating 3 contributors on the last page
    const lastPage = 5; // Simulating a last page number of 5

    const responsiveMaintainer = calculateResponsiveMaintainer(contributorsPerPage, lastPage);

    expect(responsiveMaintainer).toBeCloseTo(0.5, 1); // Approximately 0.5, rounded to 1 decimal place
  });
});


describe('bus_factor_maintainer_metric', () => {
  it('should return an array of metrics with GitHub Url', async () => {
    const repoURL = 'https://github.com/rpgeeganage/ifto'; // Adjust with a valid URL
    const metrics = await bus_factor_maintainer_metric(repoURL);

    // You can add your assertions here to test the behavior
    expect(metrics).toHaveLength(2); // Assuming it returns an array of length 2
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1); 
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
  });
  it('should return an arary of metrics with npmjs URL', async () => {
    const repoURL = 'https://www.npmjs.com/package/helmet'; 
    const metrics = await bus_factor_maintainer_metric(repoURL); 

    expect(metrics).toHaveLength(2); 
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1);  
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
  });
  it('should return an array of 0s with invalid URL', async () => {
    const repoURL = 'https://www.google.com';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with invalid GitHub URL', async () => {
    const repoURL = 'https://www.github.com/maxmichalec/invalid';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with invalid npmjs URL', async () => {
    const repoURL = 'https://www.npmjs.com/package/thispackagedoesnotexist';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with private GitHub repository', async () => {
    const repoURL = 'https://github.com/maxmichalec/ece264';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
});