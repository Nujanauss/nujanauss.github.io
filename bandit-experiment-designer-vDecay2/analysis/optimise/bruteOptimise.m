function [maxLL,fittedParams]...
            = bruteOptimise(version,rewardsArray,trueSelections,iterations,comparisons,settings)
    maxLL = -inf;
    paramSample = [];
    paramSample.simulatedData = trueSelections;
    if exist('comparisons','var')
        paramSample.comparisons = comparisons;
    end
    for i = 1:iterations
        paramSample = getParameterSampleForModel(version,paramSample,settings);
        choiceRule = getChoiceRuleForModel(version);
        LL = objectiveFunction(paramSample, @simulateData, choiceRule, rewardsArray);
        if strcmp(version,'random')
            fittedParams = paramSample;
            maxLL = LL;
            break;
        end
        if LL > maxLL
            maxLL = LL;
            fittedParams = paramSample;
        end
    end
    fittedParams = rmfield(fittedParams,'simulatedData');
    fittedParams = rmfield(fittedParams,'previousSelection');
    fittedParams = rmfield(fittedParams,'previousReward');
end