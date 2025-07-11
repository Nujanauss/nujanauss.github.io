function [probs,selections, comparisons, rewards]...
            = simulateData(rewardsArray,choiceRule,varargin)
    simulatedData = [];
    comparisonData = [];

    if ~isempty(varargin)
        params = struct(varargin{:});
        if isfield(params, 'simulatedData')
            simulatedData = params.simulatedData;
        end
        if isfield(params, 'comparisons')
            comparisonData = params.comparisons;
        end
    end
    params.previousSelection = -1;
    params.previousReward = -1;

    numTrials = length(rewardsArray);
    selections = zeros(1, numTrials);
    comparisons = zeros(1, numTrials);
    rewards = zeros(1, numTrials);
    probs = zeros(numTrials, 4);

    probabilityForEachArm = [0.25,0.25,0.25,0.25]; 
    includeComparison = isfield(params, 'upwardComparisonPercentage');
    for trial = 1:numTrials
        if isempty(simulatedData)
            selectionForTrial = randsample(1:4, 1, true, probabilityForEachArm);
        else
            selectionForTrial = simulatedData(trial);
        end

        rewardForTrial = rewardsArray(trial, selectionForTrial);

        probs(trial,:) = probabilityForEachArm;
        selections(trial) = selectionForTrial;
        rewards(trial) = rewardForTrial;

        params.previousSelection = [params.previousSelection, selectionForTrial];
        params.previousReward = [params.previousReward, rewardForTrial];

        if isempty(comparisonData) && includeComparison
            comparisons(trial) = getComparisonTargetsReward(params,rewardsArray,trial);
            params.comparisons = comparisons;
        end
        [probabilityForEachArm,params] = choiceRule(params);
    end
    selections = selections';
    comparisons = comparisons';
    rewards = rewards';
end
