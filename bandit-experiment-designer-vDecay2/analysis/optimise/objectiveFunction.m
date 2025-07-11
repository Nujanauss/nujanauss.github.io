function LL = objectiveFunction(params, simulateFuncBasis, choiceRule, rewardsArray)
    [probabilitiesForEachArm, ~, ~, ~] = simulateFuncBasis(rewardsArray, choiceRule, params);
    probabilityOfSelection = zeros(length(rewardsArray),1);
    for i = 1:length(rewardsArray) 
        probabilityOfSelection(i) = probabilitiesForEachArm(i,params.simulatedData(i));
    end
    LL = sum(log(probabilityOfSelection(probabilityOfSelection > 0)));
end
