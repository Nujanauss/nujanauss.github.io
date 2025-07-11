function outcome = simulateBayesianAgent(settings,trajectory)
    trials = settings.moves;
    rewards = NaN(arms,trials);
    for i = 1:settings.cols
        rewards(i,i) = trajectory(i,i); % select the arms in order (doesn't matter)
    end

    rt = log(value_t ./ settings.recurranceMin) ./ log(settings.decayGamma);
    posteriorGivenR = getNextValue(settings,rt);
    probRGivenData = calculateProbR(t,rt,rewards,settings);

    posterior = sum(posteriorGivenR .* probRunLengthGivenData);

    action = epsilonGreedy(posterior);

    outcome = trajectory(action, time);

    function posteriorGivenR = getNextValue(settings,rt)
        posteriorGivenR(1,:) = ones(length(rt),1) .* settings.recurranceMin;
        posteriorGivenR(2,:) = settings.recurranceMin .* settings.decayGamma.^(rt+1); 
    end

    function probRGivenData = calculateProbR(t,rt,rewards,settings)
        arms = settings.cols;
        hazardLambda = settings.hazardLambda;
        decayGamma = settings.decayGamma;
        stdDev = settings.stdDev;

        probJointRData = zeros(arms,2); % either rt is +1 or 0 for each arm

        probJointRData(:,2) = calculateJointProbRData(t,rt,rewards,hazardLambda,decayGamma,stdDev); 
        rt = zeros(arms,1);
        probJointRData(:,1) = calculateJointProbRData(t,rt,rewards,hazardLambda,decayGamma,stdDev); % rt = 0

        probRunLengthGivenData = probJointRData ./ sum(probJointRData);
    end

    function probJointRData = calculateJointProbRData(t,rt,rewards,hazardLambda,decayGamma,stdDev)
        probJointRData = 0;
        if rt < 1
            switchingRate = 1 - hazardLambda;
        else
            switchingRate = hazardLambda;
        end
        probJointRData = ...
                probJointRData... 
                + switchingRate...
                    * calculateLikelihood(rewards(t),rt,decayGamma,stdDev)...
                    * calculateJointProbRData(t-1,rt,rewards,hazardLambda,decayGamma,stdDev);
    end

    function likelihood = calculateLikelihood(x,rt,decayGamma,stdDev)
        if rt > 0
            likelihood = normpdf(data,decayGamma^r*prior,stdDev);
            return;
        end
        likelihood = 1;
    end
end