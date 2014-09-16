define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'tpl!likertScaleInteraction/tpl/propertiesForm',
    'lodash',
    'jquery',
    'taoQtiItem/qtiCreator/helper/xmlRenderer'
], function(stateFactory, Question, formElement, editor, formTpl, _, $, xmlRenderer){

    var LikertInteractionStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element;

        editor.create($container, '.prompt', function(text){
            interaction.data('prompt', text);
            interaction.updateMarkup();
//            console.log(xmlRenderer.render(interaction.getRelatedItem()));
        });

        editor.create($container, '.likert-label-min', function(text){
            interaction.prop('label-min', text);
        });

        editor.create($container, '.likert-label-max', function(text){
            interaction.prop('label-max', text);
        });

    }, function(){

        editor.destroy(this.widget.$container);

    });

    LikertInteractionStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            $form = _widget.$form,
            interaction = _widget.element,
            level = parseInt(interaction.prop('level')) || 5,
            levels = [5, 7, 9],
            levelData = {};

        //build select option data for the template
        _.each(levels, function(lvl){
            levelData[lvl] = {
                label : lvl,
                selected : (lvl === level)
            };
        });

        //render the form using the form template
        $form.html(formTpl({
            levels : levelData
        }));

        //init form javascript
        formElement.initWidget($form);

        //init data change callbacks
        formElement.setChangeCallbacks($form, interaction, {
            level : function(interaction, value){
                
                //update the pci property value:
                interaction.prop('level', value);
                
                //update rendering
                _widget.refresh();
            }
        });

    };

    return LikertInteractionStateQuestion;
});
