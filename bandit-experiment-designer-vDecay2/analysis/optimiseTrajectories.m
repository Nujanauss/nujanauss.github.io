clear all; close all; beep off; clc;

folder = fileparts(which(mfilename));
addpath(genpath(folder));

settings = getSettings();
numSimulations = 10;

trajectoryOption = generateTrajectoriesFromSettings(settings,false);
bestPossibleResult = getBestResultsPossible(trajectoryOption);
bayesAgentResuls = simulateBayesianAgent(settings,trajectoryOption);
simulationResults = simulateAgentsRunningTrajectory(settings,trajectoryOption,numSimulations);

cumulativeResults = getCumulativeResults(settings,simulationResults,numSimulations);
plotCumulativeModelResults(numSimulations,settings,simulationResults,cumulativeResults,bestPossibleResult);

precision = 20;
algorithms = {'random','randomBias','winStay','perseveration','greedy','softmax','directed','perseverationSoft','socialWinStay'};
trueSelections = results.random(1).selections;
optimisationResults = optimiseEachAlgorithmOverSelections(algorithms,trajectoryOption,trueSelections,precision,settings);


disp('stop')
