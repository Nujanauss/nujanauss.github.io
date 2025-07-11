function choiceRule = getChoiceRuleForModel(version)
    switch version
        case 'random'
            choiceRule = @randomChoiceRule;
        case 'randomBias'
            choiceRule = @randomBiasedChoiceRule;
        case 'winStay'
            choiceRule = @winStayLoseSwitchChoiceRule;
        case 'perseveration'
            choiceRule = @perseverationChoiceRule;
        case 'greedy'
            choiceRule = @epsilonGreedyChoiceRule;
        case 'softmax'
            choiceRule = @softmaxChoiceRule;
        case 'directed'
            choiceRule = @directedSoftmaxChoiceRule;
        case 'perseverationSoft'
            choiceRule = @perseveratingSoftmaxChoiceRule;
        case 'socialWinStay'
            choiceRule = @socialWinStayLoseSwitchChoiceRule;
        case 'socialEpsilonGreedy'
            choiceRule = @socialEpsilonGreedyChoiceRule;
        case 'socialSoftmax'
            choiceRule = @socialSoftmaxChoiceRule;
        case 'socialDirectedSoftmax'
            choiceRule = @socialDirectedSoftmaxChoiceRule;
        case 'socialSkillWinStay'
            choiceRule = @socialSkillWinStayLoseSwitchChoiceRule;
        case 'varianceUpdatingSoftmax'
            choiceRule = @varianceUpdatingSoftmaxChoiceRule;
    end
end
