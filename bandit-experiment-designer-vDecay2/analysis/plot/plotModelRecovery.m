function plotModelRecovery(models,rewardsArray,numAttemptsPerModel,optIterations)
    modelNames = fieldnames(models);
    simulatedModel = zeros(length(modelNames) * numAttemptsPerModel,1);
    fittedModel = zeros(length(modelNames) * numAttemptsPerModel,1);
    for k = 1:length(modelNames)
        simulatedModel(numAttemptsPerModel * (k - 1) + 1:numAttemptsPerModel * k) = k;
        for i = 1:numAttemptsPerModel
            params = getParameterSampleForModel(modelNames{k},[]);
            choiceRule = getChoiceRuleForModel(modelNames{k});
            [~,simulatedData,comparisonData,~] = simulateData(rewardsArray,choiceRule,params);
            minBIC = inf;
            for j = 1:length(modelNames)
                [LL,~] = bruteOptimise(modelNames{j},rewardsArray,simulatedData,optIterations,comparisonData);
                BIC = calcBIC(LL,size(models.(modelNames{j}),2),length(rewardsArray));
                if BIC < minBIC
                    fittedModel(i + (numAttemptsPerModel * (k - 1))) = j;
                    minBIC = BIC;
                end
            end
        end
    end
    plotConfusionMatrix(simulatedModel,fittedModel,modelNames)
end
