function chanceToWin = generateTrajectoriesFromSettings(settings,plot)    
    numTrials = settings.moves;
    numBandits = settings.cols;
    chanceToWin = zeros(numTrials,numBandits);

    decayGamma = settings.decayGamma;
    hazardLambda = settings.hazardLambda;
    stdDev = settings.stdDev;
    recurranceMin = settings.recurranceMin;
    recurranceMax = settings.recurranceMax;

    rt = randi([0, numTrials],1,2);
    initValues = recurranceMin .* decayGamma .^ rt;
    
    chanceToWin = updateChanceToWin(initValues,chanceToWin);
    if plot
        figure('Name','Bandit trajectories');plot(chanceToWin);xlim([0 numTrials + 1]);    
    end
    
    function chanceToWin = updateChanceToWin(initValues,chanceToWin)
        chanceToWin(1,:) = initValues;
        meanValues = initValues;
        for trial = 2:numTrials
            for bandit = 1:numBandits
                [chanceToWin(trial,bandit),meanValues] = generateNewValueFromDecay(bandit,meanValues);
            end
        end
    end

    function [newValue,meanValues] = generateNewValueFromDecay(bandit,meanValues) 
        currentMean = meanValues(bandit);
        if rand() < hazardLambda
            meanValues(bandit) = unifrnd(recurranceMin,recurranceMax); % Jump up to new heights
        else
            meanValues(bandit) = min(1, max(0.01, decayGamma * currentMean)); % Otherwise, usually, decay with constraints
        end
        newValue = min(1, max(0.01, normrnd(meanValues(bandit), stdDev))); % Apply Gaussian randomness
    end
end
