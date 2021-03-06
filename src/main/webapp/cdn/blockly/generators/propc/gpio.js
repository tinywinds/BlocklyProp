/**
 * Visual Blocks Language
 *
 * Copyright 2014 Michel Lampo, Vale Tolpegin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating C for gpio blocks
 * @author michel@creatingfuture.eu  (Michel Lampo)
 *         valetolpegin@gmail.com    (Vale Tolpegin)
 *         jewald@parallax.com       (Jim Ewald)
 *         mmatz@parallax.com        (Matthew Matz)
 *         kgracey@parallax.com      (Ken Gracey)
 *         carsongracey@gmail.com    (Carson Gracey)
 */
'use strict';

if (!Blockly.Blocks)
    Blockly.Blocks = {};

Blockly.Blocks.make_pin = {
    helpUrl: Blockly.MSG_PINS_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_MAKE_PIN_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.appendDummyInput("")
                .appendField("make PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
                .appendField(new Blockly.FieldDropdown([["high", "HIGH"], ["low", "LOW"], ["toggle", "TOGGLE"], ["input", "INPUT"], ["reverse", "REVERSE"]]), "ACTION");
    }
};

Blockly.propc.make_pin = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var dropdown_action = this.getFieldValue('ACTION');
    switch (dropdown_action) {
        case "HIGH":
            return 'high(' + dropdown_pin + ');\n';
        case "LOW":
            return 'low(' + dropdown_pin + ');\n';
        case "TOGGLE":
            return 'toggle(' + dropdown_pin + ');\n\tset_direction(' + dropdown_pin + ', 1);\n';
        case "INPUT":
            return 'set_direction(' + dropdown_pin + ', 0);\n';
        case "REVERSE":
            return 'reverse(' + dropdown_pin + ');\n';
    }
};

Blockly.Blocks.make_pin_input = {
    helpUrl: Blockly.MSG_PINS_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_MAKE_PIN_INPUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.appendDummyInput("")
                .appendField("make PIN");
        this.appendValueInput('PIN')
                .setCheck('Number');
        this.appendDummyInput("")
                .appendField(new Blockly.FieldDropdown([["high", "HIGH"], ["low", "LOW"], ["toggle", "TOGGLE"], ["input", "INPUT"], ["reverse", "REVERSE"]]), "ACTION");
    }
};

Blockly.propc.make_pin_input = function () {
    var pin = Blockly.propc.valueToCode(this, 'PIN', Blockly.propc.ORDER_ATOMIC) || 0;
    var dropdown_action = this.getFieldValue('ACTION');
    switch (dropdown_action) {
        case "HIGH":
            return 'high(' + pin + ');\n';
        case "LOW":
            return 'low(' + pin + ');\n';
        case "TOGGLE":
            return 'toggle(' + pin + ');\n\tset_direction(' + pin + ', 1);\n';
        case "INPUT":
            return 'set_direction(' + pin + ', 0);\n';
        case "REVERSE":
            return 'reverse(' + pin + ');\n';
    }
};

Blockly.Blocks.check_pin = {
    helpUrl: Blockly.MSG_PINS_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_CHECK_PIN_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput("")
                .appendField("check PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.setOutput(true, 'Number');
    }
};

Blockly.propc.check_pin = function () {
    var dropdown_pin = this.getFieldValue('PIN');

    var code = 'input(' + dropdown_pin + ')';
    return [code, Blockly.propc.ORDER_ATOMIC];
};

Blockly.Blocks.check_pin_input = {
    helpUrl: Blockly.MSG_PINS_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_CHECK_PIN_INPUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput("")
                .appendField("check PIN");
        this.appendValueInput('PIN')
                .setCheck('Number');
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.propc.check_pin_input = function () {
    var dropdown_pin = Blockly.propc.valueToCode(this, 'PIN', Blockly.propc.ORDER_UNARY_PREFIX) || '0';

    var code = 'input(' + dropdown_pin + ')';
    return [code, Blockly.propc.ORDER_ATOMIC];
};

Blockly.Blocks.set_pins = {
    helpUrl: Blockly.MSG_PINS_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_SET_PINS_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        var start_pin = [];
        for (var i = 0; i < 14; i++) {
            start_pin.push([i.toString(), i.toString()]);
        }
        var pin_count = [];
        for (var i = 0; i < 14; i++) {
            pin_count.push([i.toString(), i.toString()]);
        }
        this.appendDummyInput("")
                .appendField("set the")
                .appendField(new Blockly.FieldDropdown([["states", "STATE"], ["directions", "DIRECTION"]], function (action) {
                    this.sourceBlock_.updateShape_({"ACTION": action});
                }), "ACTION")
                .appendField("from PIN")
                .appendField(new Blockly.FieldDropdown(pin_count, function (startPin) {
                    this.sourceBlock_.updateShape_({"START_PIN": startPin});
                }), "START_PIN")
                .appendField("to PIN")
                .appendField(new Blockly.FieldDropdown(start_pin, function (pinCount) {
                    this.sourceBlock_.updateShape_({"PIN_COUNT": pinCount});
                }), "PIN_COUNT");
        this.appendDummyInput("PINS")
                .appendField("values:")
                .appendField("P0:")
                .appendField(new Blockly.FieldDropdown([["HIGH", "1"], ["LOW", "0"]]), "P0");
    },
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var action = this.getFieldValue('ACTION');
        container.setAttribute('action', action);
        var pinCount = this.getFieldValue('PIN_COUNT');
        container.setAttribute('pin_count', pinCount);
        var startPin = this.getFieldValue('START_PIN');
        container.setAttribute('start_pin', startPin);
        return container;
    },
    domToMutation: function (xmlElement) {
        var action = xmlElement.getAttribute('action');
        var pinCount = xmlElement.getAttribute('pin_count');
        var startPin = xmlElement.getAttribute('start_pin');
        //var type = this.getFieldValue('TYPE');
        this.updateShape_({"ACTION": action, "PIN_COUNT": pinCount, "START_PIN": startPin});
    },
    updateShape_: function (details) {
        var data = [];
        for (var i = 0; i < 32; i++) {
            data.push(this.getFieldValue('P' + i));
        }

        var action = details['ACTION'];
        if (details['ACTION'] === undefined) {
            action = this.getFieldValue('ACTION');
        }
        var pinCount = details['PIN_COUNT'];
        if (details['PIN_COUNT'] === undefined) {
            pinCount = this.getFieldValue('PIN_COUNT');
        }
        var startPin = details['START_PIN'];
        if (details['START_PIN'] === undefined) {
            startPin = this.getFieldValue('START_PIN');
        }
        pinCount = Number(pinCount);
        startPin = Number(startPin);

        this.removeInput('PINS');
        this.appendDummyInput("PINS")
                .appendField("Values:");
        var inputPins = this.getInput('PINS');
        for (var i = 0; i < (pinCount - startPin + 1); i++) {
            var pin = startPin + i;
            if (action === 'STATE') {
                inputPins.appendField("P" + pin + ":")
                        .appendField(new Blockly.FieldDropdown([["HIGH", "1"], ["LOW", "0"]]), "P" + pin);
            } else if (action === 'DIRECTION') {
                inputPins.appendField("P" + pin + ":")
                        .appendField(new Blockly.FieldDropdown([["OUT", "1"], ["IN", "0"]]), "P" + pin);
            }
        }

        for (var i = 0; i < 32; i++) {
            if (this.getField('P' + i) && data[i] !== null) {
                this.setFieldValue(data[i], 'P' + i);
            }
        }
    }
};

Blockly.propc.set_pins = function () {
    var code = '';
    var action = this.getFieldValue('ACTION');
    var dropdown_pin_count = Number(this.getFieldValue('PIN_COUNT'));
    var dropdown_start_pin = Number(this.getFieldValue('START_PIN'));
    if (action === 'STATE') {
        code = 'set_outputs(';
    } else if (action === 'DIRECTION') {
        code = 'set_directions(';
    }
    //var highestPin = dropdown_start_pin + dropdown_pin_count - 1;
    
    code += dropdown_pin_count;
    code += ', ';
    code += dropdown_start_pin;
    code += ', 0b';
    for (var i = dropdown_pin_count; i >= dropdown_start_pin; i--) {
        code += this.getFieldValue('P' + i);
    }
    return code + ');\n';
};

Blockly.Blocks.base_freqout = {
    helpUrl: Blockly.MSG_AUDIO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_BASE_FREQOUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput("")
                .appendField("frequency PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendValueInput("DURATION", 'Number')
                .appendField("duration (ms)")
                .setCheck('Number');
        this.appendValueInput("FREQUENCY", 'Number')
                .appendField("frequency (Hz)")
                .setCheck('Number');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.base_freqout = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var duration = Blockly.propc.valueToCode(this, 'DURATION', Blockly.propc.ORDER_ATOMIC) || 1000;
    var frequency = Blockly.propc.valueToCode(this, 'FREQUENCY', Blockly.propc.ORDER_ATOMIC) || 3000;

    var code = 'freqout(' + dropdown_pin + ', ' + duration + ', ' + frequency + ');\n';

    return code;
};

Blockly.Blocks.base_count = {
    helpUrl: Blockly.MSG_ANALOG_PULSE_IN_OUT_HELPURL,
    init: function() {
	//this.setTooltip(Blockly.MSG_BASE_FREQOUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput("")
                .appendField("count pulses PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendValueInput("DURATION", 'Number')
                .appendField("duration (ms)")
                .setCheck('Number');
        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Number');
    }
};

Blockly.propc.base_count = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var duration = Blockly.propc.valueToCode(this, 'DURATION', Blockly.propc.ORDER_ATOMIC) || '1';

    var code = 'count(' + dropdown_pin + ', ' + duration + ')';

    return [code, Blockly.propc.ORDER_NONE];
};

Blockly.Blocks.pulse_in = {
    helpUrl: Blockly.MSG_ANALOG_PULSE_IN_OUT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_PULSE_IN_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("pulse-in PIN")
            .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendDummyInput()
            .appendField("read")
            .appendField(new Blockly.FieldDropdown([["negative/low pulses", "0"], ["positive/high pulses", "1"]]), "STATE");

        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Number');
    }
};

Blockly.propc.pulse_in = function() {
    var pin = this.getFieldValue("PIN");
    var state = this.getFieldValue("STATE");

    var code = 'pulse_in(' + pin + ', ' + state + ')';
    return [code, Blockly.propc.ORDER_NONE];
};

Blockly.Blocks.pulse_out = {
    helpUrl: Blockly.MSG_ANALOG_PULSE_IN_OUT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_PULSE_OUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("pulse-out PIN")
            .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendValueInput('PULSE_LENGTH')
            .appendField("pulse length (" + "\u00B5" + "s)");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.pulse_out = function() {
    var pin = this.getFieldValue("PIN");
    var pulse_length = Blockly.propc.valueToCode(this, 'PULSE_LENGTH', Blockly.propc.ORDER_ATOMIC);

    return 'pulse_out(' + pin + ', ' + pulse_length + ');\n';
};

Blockly.Blocks.rc_charge_discharge = {
    helpUrl: Blockly.MSG_ANALOG_RC_TIME_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_RC_CHARGE_DISCHARGE_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput("")
            .appendField("RC")
            .appendField(new Blockly.FieldDropdown([["charge", "0"], ["discharge", "1"]]), "STATE");
        this.appendDummyInput("")
            .appendField("PIN")
            .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Number');
    }
};

Blockly.propc.rc_charge_discharge = function() {
    var pin = this.getFieldValue("PIN");
    var state = this.getFieldValue("STATE");

    var code = 'rc_time(' + pin + ', ' + state + ')';
    return [code, Blockly.propc.ORDER_NONE];
};

// --------------- EEPROM Memory Blocks ----------------------------------------
Blockly.Blocks.eeprom_write = {
    helpUrl: Blockly.MSG_EEPROM_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_EEPROM_WRITE_TOOLTIP);
        this.setColour(colorPalette.getColor('input'));
        this.appendValueInput("DATA")
            .setCheck(null)
            .appendField("EEPROM write")
            .appendField(new Blockly.FieldDropdown([["number", "NUMBER"], ["text", "TEXT"], ["byte", "BYTE"]]), "TYPE");
        this.appendValueInput("ADDRESS")
            .setCheck("Number")
            .appendField("to address");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.eeprom_write = function () {
    var type = this.getFieldValue('TYPE');
    var address = Blockly.propc.valueToCode(this, 'ADDRESS', Blockly.propc.ORDER_ATOMIC);
    var data = Blockly.propc.valueToCode(this, 'DATA', Blockly.propc.ORDER_ATOMIC) || '';
    
    var setup_code = '// Constrain Function\nint constrain(int __cVal, int __cMin, int __cMax) {';
    setup_code += 'if(__cVal < __cMin) __cVal = __cMin;\n';
    setup_code += 'if(__cVal > __cMax) __cVal = __cMax;\nreturn __cVal;\n}\n';
    Blockly.propc.global_vars_["constrain_function"] = setup_code;
    
    var code = '';
    if(data !== '') {
        if (type === 'BYTE') {
            code += 'ee_putByte((' + data + ' & 255), (32768 + constrain(' + address + ', 0, 7675)) );\n';
        } else if (type === 'NUMBER') {
            code += 'ee_putInt(' + data + ', (32768 + constrain(' + address + ', 0, 7675)) );\n';
        } else {
            code += 'ee_putStr(' + data + ', (strlen(' + data + ') + 1), (32768 + constrain(' + address + ', 0, 7675)) );\n';        
        }
    }
    
    return code;
};

Blockly.Blocks.eeprom_read = {
    helpUrl: Blockly.MSG_EEPROM_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_EEPROM_READ_TOOLTIP);
        this.setColour(colorPalette.getColor('input'));
        this.appendValueInput("ADDRESS")
            .setCheck("Number")
            .appendField("EEPROM read")
            .appendField(new Blockly.FieldDropdown([["number", "NUMBER"], ["text", "TEXT"], ["byte", "BYTE"]]), "TYPE")
            .appendField("from address");
        this.appendDummyInput()
                .appendField("store in")
                .appendField(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_GET_ITEM), 'VALUE');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    getVars: function () {
        return [this.getFieldValue('VALUE')];
    },
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VALUE'))) {
            this.setTitleValue(newName, 'VALUE');
        }
    }
};

Blockly.propc.eeprom_read = function () {
    var type = this.getFieldValue('TYPE');
    var address = Blockly.propc.valueToCode(this, 'ADDRESS', Blockly.propc.ORDER_ATOMIC);
    var data = Blockly.propc.variableDB_.getName(this.getFieldValue('VALUE'), Blockly.Variables.NAME_TYPE);    

    Blockly.propc.global_vars_["i2c_eepromAddr"] = 'int __eeAddr;';
    
    var code = '__eeAddr = ' + address + ';\n';
    code += 'if(__eeAddr < 0) __eeAddr = 0;\n';
    code += 'if(__eeAddr > 7675) __eeAddr = 7675;\n';
        
    if(data !== '') {
        if (type === 'BYTE') {
            code += data + ' = ee_getByte( 32768 + __eeAddr ) & 255;\n';
        } else if (type === 'NUMBER') {
            code += data + ' = ee_getInt( 32768 + __eeAddr );\n';
        } else {
            Blockly.propc.global_vars_["i2c_eeBffr"] = 'char __eeBffr[1];';
            Blockly.propc.global_vars_["i2c_eeIdx"] = 'int __eeIdx = 0;';
            Blockly.propc.vartype_[data] = 'char *';   
            code += '// Get the string from EEPROM one character at a time until it finds the end of the string.\n';
            code += '__eeIdx = 0;\n';
            code += 'while(__eeIdx < 128) {\n  ee_getStr(__eeBffr, 1, (32768 + __eeAddr) + __eeIdx);\n';
            code += '  ' + data + '[__eeIdx] = __eeBffr[0];\n';
            code += '  if(' + data + '[__eeIdx] == 0) break;\n  __eeIdx++;\n}\n';
            code += '  if(__eeIdx >= 128) ' + data + '[127] = 0;\n';
        }
    }
    
    return code;
};

// ------------------ Servo motor blocks ---------------------------------------
Blockly.Blocks.servo_move = {
    helpUrl: Blockly.MSG_SERVO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_SERVO_MOVE_TOOLTIP);
        this.setColour(colorPalette.getColor('output'));
        this.appendDummyInput()
            .appendField("Servo PIN")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendValueInput("ANGLE")
            .appendField("set angle (0-180\u00B0)")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.servo_move = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var degrees = Blockly.propc.valueToCode(this, 'ANGLE', Blockly.propc.ORDER_NONE);

    Blockly.propc.definitions_["include servo"] = '#include "servo.h"';
    if (degrees < 0) {
        degrees = 0;
    }
    if (degrees > 180) {
        degrees = 180;
    }
    var code = 'servo_angle(' + dropdown_pin + ', ' + degrees + ' * 10);\n';
    return code;
};

Blockly.Blocks.servo_speed = {
    helpUrl: Blockly.MSG_SERVO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_SERVO_SPEED_TOOLTIP);
        this.setColour(colorPalette.getColor('output'));
        this.appendDummyInput()
                .appendField("CR Servo PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN');
        this.appendValueInput("SPEED")
                .appendField("speed")
                .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.servo_speed = function () {
    var pin = this.getFieldValue('PIN');
    var speed = Blockly.propc.valueToCode(this, 'SPEED', Blockly.propc.ORDER_NONE);

    Blockly.propc.definitions_["include servo"] = '#include "servo.h"';

    return 'servo_speed(' + pin + ', ' + speed + ');\n';
};

Blockly.Blocks.servo_set_ramp = {
    helpUrl: Blockly.MSG_SERVO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_SERVO_SET_RAMP_TOOLTIP);
        this.setColour(colorPalette.getColor('output'));
        this.appendDummyInput()
                .appendField("CR Servo set ramp PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN');
        this.appendValueInput('RAMPSTEP')
                .appendField("rampstep (0 - 100)")
                .setCheck('Number');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.servo_set_ramp = function () {
    var pin = this.getFieldValue('PIN');
    var ramp_step = Blockly.propc.valueToCode(this, 'RAMPSTEP', Blockly.propc.ORDER_NONE);

    if (Number(ramp_step) < 0) {
      ramp_step = "0";
    } else if (Number(ramp_step) > 100) {
      ramp_step = "100";
    }

    Blockly.propc.definitions_["include servo"] = '#include "servo.h"';

    return 'servo_setramp(' + pin + ', ' + ramp_step + ');\n';
};

// --------- ActivityBoard A/D and D/A voltage measurement/generation blocks ---
Blockly.Blocks.ab_volt_in = {
    helpUrl: Blockly.MSG_ANALOG_PULSES_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_AB_VOLT_IN_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("A/D channel")
            .appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]]), "CHANNEL")
            .appendField("read (0-5V) in volt-100ths");
        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
    }
};

Blockly.propc.ab_volt_in = function() {
    var dropdown_channel = this.getFieldValue('CHANNEL');

    Blockly.propc.definitions_["include abvolt"] = '#include "abvolts.h"';
    if (Blockly.propc.setups_['setup_abvolt'] === undefined) {
        Blockly.propc.setups_['setup_abvolt'] = 'ad_init(21, 20, 19, 18);';
    }

    var code = '(ad_in(' + dropdown_channel + ') * 500 / 4096)';
    return [code, Blockly.propc.ORDER_NONE];
};

Blockly.Blocks.ab_volt_out = {
    helpUrl: Blockly.MSG_ANALOG_PULSES_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_AB_VOLT_OUT_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
                .appendField("D/A channel")
                .appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"]]), "CHANNEL")
                .appendField("output (0-3.3V)");
                this.appendValueInput("VALUE")
                .setCheck('Number')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("volt-100ths");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.ab_volt_out = function() {
    var dropdown_channel = this.getFieldValue('CHANNEL');
    var value = Blockly.propc.valueToCode(this, 'VALUE', Blockly.propc.ORDER_NONE) || '0';

    Blockly.propc.definitions_["include abvolt"] = '#include "abvolts.h"';
    if (Blockly.propc.setups_['setup_abvolt_out'] === undefined) {
        Blockly.propc.setups_['setup_abvolt_out'] = 'da_init(26, 27);';
    }

    var code = 'da_out(' + dropdown_channel + ', (' + value + '* 256 / 330));\n';
    return code;
};

// ------------- PWM (Pulse-width modulation) Blocks ---------------------------
Blockly.Blocks.pwm_start = {
    helpUrl: Blockly.MSG_ANALOG_PWM_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_PWM_START_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
                .appendField("PWM initialize");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.pwm_start = function () {
    var code = 'pwm_start(100);\n';
    return code;
};

Blockly.Blocks.pwm_set = {
    helpUrl: Blockly.MSG_ANALOG_PWM_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_PWM_SET_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
                .appendField("PWM set PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
        this.appendDummyInput()
                .appendField("channel")
                .appendField(new Blockly.FieldDropdown([["A", "0"], ["B", "1"]]), "CHANNEL");
        this.appendValueInput("DUTY_CYCLE", Number)
                .setCheck('Number')
                .appendField("duty cycle (0 - 100)");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.pwm_set = function () {
    var pin = this.getFieldValue("PIN");
    var channel = this.getFieldValue("CHANNEL");
    var duty_cycle = Blockly.propc.valueToCode(this, "DUTY_CYCLE", Blockly.propc.ORDER_NONE);

    if (Number(duty_cycle) < 0) {
        duty_cycle = '0';
    } else if (Number(duty_cycle) > 100) {
        duty_cycle = '100';
    }

    var code = 'pwm_set(' + pin + ', ' + channel + ', ' + duty_cycle + ');\n';
    return code;
};

Blockly.Blocks.pwm_stop = {
    helpUrl: Blockly.MSG_ANALOG_PWM_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_PWM_STOP_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
                .appendField("PWM stop");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.pwm_stop = function () {
    var code = 'pwm_stop();\n';
    return code;
};

// ----------------- .WAV file audio player blocks -----------------------------
Blockly.Blocks.wav_play = {
    helpUrl: Blockly.MSG_AUDIO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_WAV_PLAY_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("WAV play file")
            .appendField(new Blockly.FieldTextInput('File_name'), 'FILENAME');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.wav_play = function() {
    var filename = this.getFieldValue('FILENAME');

    Blockly.propc.definitions_["include wavplayer"] = '#include "wavplayer.h"';
    Blockly.propc.setups_["sd_card"] = 'int DO = 22, CLK = 23, DI = 24, CS = 25;\n\tsd_mount(DO, CLK, DI, CS);\n';

    var code = 'wav_play("' + filename + '.wav");\n';
    return code;
};

Blockly.Blocks.wav_status = {
    helpUrl: Blockly.MSG_AUDIO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_WAV_STATUS_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("WAV status");

        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Number');
    }
};

Blockly.propc.wav_status = function() {
    Blockly.propc.definitions_["include wavplayer"] = '#include "wavplayer.h"';

    var code = 'wav_playing()';
    return [code, Blockly.propc.ORDER_NONE];
};

Blockly.Blocks.wav_volume = {
    helpUrl: Blockly.MSG_AUDIO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_WAV_VOLUME_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendValueInput('VOLUME')
            .appendField("WAV volume (0 - 10)");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.wav_volume = function() {
    var volume = Blockly.propc.valueToCode(this, 'VOLUME', Blockly.propc.ORDER_NONE) || '0';

    Blockly.propc.definitions_["include wavplayer"] = '#include "wavplayer.h"';

    if (Number(volume) < 0) {
        volume = '0';
    } else if (Number(volume) > 10) {
        volume = '10';
    }

    var code = 'wav_volume(' + volume + ');\n';
    return code;
};

Blockly.Blocks.wav_stop = {
    helpUrl: Blockly.MSG_AUDIO_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_WAV_STOP_TOOLTIP);
        this.setColour(colorPalette.getColor('io'));
        this.appendDummyInput()
            .appendField("WAV stop");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.wav_stop = function() {
    var code = 'wav_stop();\n';
    return code;
};

// ----------------- Robot (drive) blocks --------------------------------------
Blockly.Blocks.ab_drive_init = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ROBOT_DRIVE_INIT_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendDummyInput()
                .appendField("Robot")
                .appendField(new Blockly.FieldDropdown([["ActivityBot", "abdrive.h"], ["Arlo", "arlodrive.h"], ["Servo Differential Drive", "servodiffdrive.h"]], function (bot) {
                    this.sourceBlock_.updateShape_({"BOT": bot});
                }), "BOT")
                .appendField("initialize"); 
        this.appendDummyInput("PINS")
                .appendField(" ramping")
                .appendField(new Blockly.FieldDropdown([["none", "64"], ["light", "8"], ["medium", "4"], ["heavy", "2"], ["maximum", "1"]]), "RAMPING");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

    },
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var bot = this.getFieldValue('BOT');
        container.setAttribute('BOT', bot);
        return container;
    },
    domToMutation: function (xmlElement) {
        var bot = xmlElement.getAttribute('BOT');
        this.updateShape_({"BOT": bot});
    },
    updateShape_: function (details) {

        var bot = details['BOT'];
        if (details['BOT'] === undefined) {
            bot = this.getFieldValue('BOT');
        }

        this.removeInput('PINS');
        this.appendDummyInput("PINS");
        var inputPins = this.getInput('PINS');
        if (bot === 'servodiffdrive.h') {
            inputPins.appendField(" left PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "LEFT")
                .appendField("right PIN")
                .appendField(new Blockly.FieldDropdown(profile.default.digital), "RIGHT")
                .appendField(" ramping")
                .appendField(new Blockly.FieldDropdown([["none", "64"], ["light", "8"], ["medium", "4"], ["heavy", "2"], ["maximum", "1"]]), "RAMPING");
        } else {
            inputPins.appendField(" ramping")
                .appendField(new Blockly.FieldDropdown([["none", "64"], ["light", "8"], ["medium", "4"], ["heavy", "2"], ["maximum", "1"]]), "RAMPING");
        }
    }
};

Blockly.propc.ab_drive_init = function() {
    var bot = this.getFieldValue('BOT');
    var left = Number(this.getFieldValue('LEFT'));
    var right = Number(this.getFieldValue('RIGHT'));
    var ramping = Number(this.getFieldValue('RAMPING'));

    Blockly.propc.definitions_["include abdrive"] = '#include "' + bot + '"';

    if(Blockly.propc.definitions_["include abdrive"] === '#include "servodiffdrive.h"') {
        Blockly.propc.setups_["servodiffdrive"] = 'drive_pins(' + left + ',' + right + ');\n';
        Blockly.propc.setups_["sdd_ramping"] = 'drive_setramp(' + ramping + ',' + ramping + ');\n';	
    } else {
        Blockly.propc.setups_["abd_ramping"] = 'drive_setRampStep(' + ramping + ');\n';
    }
    
    return '';
};

Blockly.Blocks.ab_drive_goto = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ROBOT_DRIVE_DISTANCE_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendDummyInput()
                .appendField('Robot drive distance in')
                .appendField(new Blockly.FieldDropdown([["ticks", "TICK"], ["centimeters", "CM"], ["inches", "INCH"]]), "UNITS");
        this.appendValueInput("LEFT")
                .setCheck('Number')
                .appendField("left");
        this.appendValueInput("RIGHT")
                .setCheck('Number')
                .appendField("right");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.ab_drive_goto = function() {
    var left = Blockly.propc.valueToCode(this, 'LEFT', Blockly.propc.ORDER_NONE);
    var right = Blockly.propc.valueToCode(this, 'RIGHT', Blockly.propc.ORDER_NONE);
    var units = this.getFieldValue('UNITS');
    var bot = Blockly.propc.definitions_["include abdrive"];

    var code = '';
    
    if(bot === '#include "servodiffdrive.h"') {
        code += '// Servo Differential Drive does not support "Drive Distance"\n';
    } else if(bot === '#include "abdrive.h"') {
        if(units === 'TICK') {
            code += 'drive_goto(' + left + ', ' + right + ');\n';
        } else if(units === 'CM') {
            code += 'drive_goto((' + left + ' * 40)/13, (' + right + ' * 40)/13);\n';
        } else {
            code += 'drive_goto((' + left + ' * 508)/65, (' + right + ' * 508)/65);\n';            
        }
    } else {
        if(units === 'TICK') {
            code += 'drive_goto(' + left + ', ' + right + ');\n';
        } else if(units === 'CM') {
            code += 'drive_goto((' + left + ' * 253)/90, (' + right + ' * 253)/90);\n';            
        } else {
            code += 'drive_goto((' + left + ' * 50)/7, (' + right + ' * 50)/7);\n';            
        }        
    }
    
    if(bot === undefined) {
        return '// Robot drive system is not initialized!\n';
    } else {
        return code;
    }
};

Blockly.Blocks.ab_drive_speed = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ROBOT_DRIVE_SPEED_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendValueInput("LEFT")
                .setCheck('Number')
                .appendField("Robot drive speed left");
        this.appendValueInput("RIGHT")
                .setCheck('Number')
                .appendField("right");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.ab_drive_speed = function() {
    var left = Blockly.propc.valueToCode(this, 'LEFT', Blockly.propc.ORDER_NONE);
    var right = Blockly.propc.valueToCode(this, 'RIGHT', Blockly.propc.ORDER_NONE);
    var bot = Blockly.propc.definitions_["include abdrive"];
    
    var code = '';
    
    if(bot === '#include "servodiffdrive.h"') {
        code = 'drive_speeds(' + left + ', ' + right + ');\n';
    } else {
        if(Blockly.propc.setups_["abd_ramping"] === 'drive_setRampStep(64);\n') {
            code = 'drive_speed(' + left + ', ' + right + ');\n';
        } else {
            code = 'drive_ramp(' + left + ', ' + right + ');\n';
        }
    }

    if(bot === undefined) {
        return '// Robot drive system is not initialized!\n';
    } else {
        return code;
    }
};

Blockly.Blocks.ab_drive_stop = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ROBOT_DRIVE_STOP_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendDummyInput()
                .appendField("Robot drive stop");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.ab_drive_stop = function() {
    var left = Blockly.propc.valueToCode(this, 'LEFT', Blockly.propc.ORDER_NONE);
    var right = Blockly.propc.valueToCode(this, 'RIGHT', Blockly.propc.ORDER_NONE);
    var bot = Blockly.propc.definitions_["include abdrive"];
    
    var code = '';
    
    if(bot === '#include "servodiffdrive.h"') {
        code = 'drive_speeds(0, 0);\n';
    } else {
        if(Blockly.propc.setups_["abd_ramping"] === 'drive_setRampStep(64);\n') {
            code = 'drive_speed(0, 0);\n';
        } else {
            code = 'drive_ramp(0, 0);\n';
        }
    }

    if(bot === undefined) {
        return '// Robot drive system is not initialized!\n';
    } else {
        return code;
    }
};

Blockly.Blocks.activitybot_calibrate = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ACTIVITYBOT_CALIBRATE_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendDummyInput()
            .appendField("ActivityBot calibrate");
    }
};

Blockly.propc.activitybot_calibrate = function() {
    Blockly.propc.definitions_["activitybot_calibrate"] = '#include "abcalibrate.h"';
    Blockly.propc.setups_["activitybot_calibrate"] = 'cal_servoPins(12, 13);\n\tcal_encoderPins(14, 15);';

    return 'high(26);\nhigh(27);\ncal_activityBot();\nlow(26);\nlow(27);\n';
};

Blockly.Blocks.activitybot_display_calibration = {
    helpUrl: Blockly.MSG_ROBOT_HELPURL,
    init: function() {
	this.setTooltip(Blockly.MSG_ACTIVITYBOT_DISPLAY_CALIBRATION_TOOLTIP);
        this.setColour(colorPalette.getColor('robot'));
        this.appendDummyInput()
            .appendField("ActivityBot display calibration");
    }
};

Blockly.propc.activitybot_display_calibration = function() {
    Blockly.propc.definitions_["include abdrive"] = '#include "abdrive.h"';

    Blockly.propc.serial_terminal_ = true;
    
    var code = '';
    code += 'int abd_intTabSetup;\n';
    code += 'volatile int abd_elCntL, abd_elCntR, abd_elCntL, abd_elCntR, abd_cntrLidx, abd_cntrRidx;\n';
    code += 'int abd_spdrL[120], abd_spdmL[120], abd_spdrR[120], abd_spdmR[120];\n';

    Blockly.propc.global_vars_["activitybot_display_calibration"] = code;

    code = '';
    code += 'if(!abd_intTabSetup) interpolation_table_setup();\n';
    code += 'print("=== LEFT SERVO ===\\n");\n';
    code += 'print("Table Entries = %d, Zero Speed Index = %d\\n\\n", abd_elCntL, abd_cntrLidx);\n';
    code += 'print("Index, Servo Drive, Encoder Ticks/Second\\n");\n';
    code += 'for(int __rIdx = 0; __rIdx < abd_elCntL; __rIdx++) print("%d, %d, %d\\n", __rIdx, abd_spdrL[__rIdx], abd_spdmL[__rIdx]);\n';
    code += 'print("\\n\\n=== RIGHT SERVO ===\\n");\n';
    code += 'print("Table Entries = %d, Zero Speed Index = %d\\n\\n", abd_elCntR, abd_cntrRidx);\n';
    code += 'print("Index, Servo Drive, Encoder Ticks/Second\\n");\n';
    code += 'for(int __rIdx = 0; __rIdx < abd_elCntR; __rIdx++) print("%d, %d, %d\\n", __rIdx, abd_spdrR[__rIdx], abd_spdmR[__rIdx]);\n';

    return code;
};
