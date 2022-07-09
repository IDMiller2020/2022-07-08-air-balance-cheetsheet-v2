const app = Vue.createApp({})
app.component('duct-calculators', {
  template: `
  <h1>{{ title }}</h1>
  <calculator
    v-for="calculator in calculators"
      v-bind:calculatorName="calculator.name"
      v-bind:calculatorInputs="calculator.inputs"
      v-bind:calculation="calculator.methodCall"
      v-bind:calculatorOutput="calculator.output"
  />
  `,
  data() {
    return {
      title: 'Duct Calculations',
      calculators: [
        {
          name: 'Round Duct Cross-Sectional Area',
          inputs: [
            {
              label: 'Diameter',
              inputValue: 0,
              unit: 'in'
            }
          ],
          methodCall: 'roundArea',
          output: 'sq ft = '
        },
        {
          name: 'Rectangular Duct Cross-Sectional Area',
          inputs: [
            {
              label: 'Height',
              inputValue: 0,
              unit: 'in'
            },
            {
              label: 'Width',
              inputValue: 0,
              unit: 'in'
            }
          ],
          methodCall: 'rectangularArea',
          output: 'sq ft ='
        },
        {
          name: 'Feet Per Minute (fpm) to Cubic Feet Per Minute (cfm)',
          inputs: [
            {
              label: 'Velocity',
              inputValue: 0,
              unit: 'fpm'
            },
            {
              label: 'Area',
              inputValue: 0,
              unit: 'sq ft'
            }
          ],
          methodCall: 'fpmToCfm',
          output: 'cfm ='
        },
        {
          name: 'New Static Pressure From Old cfm and New cfm',
          inputs: [
            {
              label: 'New CFM (Desired CFM)',
              inputValue: 0,
              unit: 'cfm'
            },
            {
              label: 'Old CFM',
              inputValue: 0,
              unit: 'cfm'
            },
          ],
          methodCall: 'cfmToStatic',
          output: 'in WC ='
        }
      ]
    }
  },
  components: ['calculator']
})
app.component('calculator',{
  template: `
  <form v-on:submit.prevent="calculateResult(calculation)">
    <h4>{{ calculatorName }}</h4>
    <calculator-inputs
      v-for="input in calculatorInputs"
        v-bind:calculatorInputLabel="input.label"
        v-bind:unitInfo="input.unit"
        v-model="input.inputValue"
    />
    <button>Calculate</button>
  </form>
  <div :id=calculation>
    <p>{{ calculatorOutput }}</p>
  </div>
  `,
  methods: {
    calculateResult(calculation) {
      if (calculation === 'roundArea') {
        const roundDuctDiameterFeet = this.calculatorInputs[0].inputValue / 12
        const radius = roundDuctDiameterFeet * 0.5
        const roundDuctArea = Math.PI * Math.pow(radius, 2)
        let answerText = document.getElementById('roundArea')
        answerText.innerText = 'sq ft = ' + roundDuctArea.toFixed(5)
      } else if (calculation === 'rectangularArea') {
        const rectangularAreaFeet = (this.calculatorInputs[0].inputValue * this.calculatorInputs[1].inputValue) / 144
        let answerText = document.getElementById('rectangularArea')
        answerText.innerText = 'sq ft = ' + rectangularAreaFeet.toFixed(5)
      } else if (calculation === 'fpmToCfm') {
        const cfm = (this.calculatorInputs[0].inputValue * this.calculatorInputs[1].inputValue)
        let answerText = document.getElementById('fpmToCfm')
        answerText.innerText = 'cfm = ' + cfm.toFixed(5)
      } else if (calculation === 'cfmToStatic') {
        const cfmRatio = this.calculatorInputs[0].inputValue / this.calculatorInputs[1].inputValue
        const newStatic = Math.pow(cfmRatio, 2)
        let answerText = document.getElementById('cfmToStatic')
        answerText.innerText = 'in WC = ' + newStatic.toFixed(5)
      }else {
        console.log('huh? Whats that? error... error... error...')
      }
    },
  },
  computed: {
    updateInputValue: {
      get() {
        return this.modelValue
      },
      set(calculatorInput) {
        this.$emit('update:modelValue', calculatorInput)
      }
    }
  },
  props: ['calculatorName', 'calculatorInputs', 'calculation', 'calculatorOutput', 'modelValue'],
  components: ['calculator-inputs']
})
app.component('calculator-inputs', {
  template: `
    <label>
      <p>{{ calculatorInputLabel }}
      (<em>{{ unitInfo }}</em>)
      <input type="number" step="any" v-model="calculatorInputValue" /></p>
    </label>
  `,
  computed: {
    calculatorInputValue: {
      get() {
        return this.modelValue
      },
      set(userInput) {
        this.$emit('update:modelValue', userInput)
      }
    }
  },
  props: ['calculatorInputLabel', 'unitInfo', 'modelValue']
})
app.mount('#app')