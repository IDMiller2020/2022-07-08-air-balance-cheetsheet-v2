const app = Vue.createApp({})
app.component('duct-calculators', {
  template: `
  <h2>Duct Calculations</h2>
  <calculator
    v-for="calculator in ductCalculators"
      v-bind:calculatorName="calculator.name"
      v-bind:calculatorInputs="calculator.inputs"
      v-bind:calculation="calculator.methodCall"
      v-bind:calculatorOutput="calculator.output"
  />
  <hr>
  <h2>Air Flow Calculations</h2>
  <calculator
    v-for="calculator in airCalculators"
      v-bind:calculatorName="calculator.name"
      v-bind:calculatorInputs="calculator.inputs"
      v-bind:calculation="calculator.methodCall"
      v-bind:calculatorOutput="calculator.output"
  />
  `,
  data() {
    return {
      ductCalculators: [
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
        }
      ],
      airCalculators: [
        {
          name: 'Calculate cfm from fpm.',
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
          name: 'Calculate sp for desired cfm.',
          inputs: [
            {
              label: 'Desired cfm',
              inputValue: 0,
              unit: 'cfm'
            },
            {
              label: 'Old cfm',
              inputValue: 0,
              unit: 'cfm'
            },
            {
              label: 'Old sp',
              inputValue: 0,
              unit: 'in WC'
            }
          ],
          methodCall: 'cfmToStatic',
          output: 'in WC ='
        },
        {
          name: 'Calculate rpm for desired cfm.',
          inputs: [
            {
              label: 'Old rpm',
              inputValue: 0,
              unit: 'rpm'
            },
            {
              label: 'Old cfm',
              inputValue: 0,
              unit: 'cfm'
            },
            {
              label: 'Desired cfm',
              inputValue: 0,
              unit: 'cfm'
            }
          ],
          methodCall: 'rpmToCfm',
          output: 'rpm ='
        },
        {
          name: 'Calculate amp for new cfm',
          inputs: [
            {
              label: 'Old amp',
              inputValue: 0,
              unit: 'amp'
            },
            {
              label: 'New cfm',
              inputValue: 0,
              unit: 'cfm'
            },
            {
              label: 'Old cfm',
              inputValue: 0,
              unit: 'cfm'
            }
          ],
          methodCall: 'cfmToAmp',
          output: 'amp ='
        }
      ]
    }
  },
  components: ['calculator']
})
app.component('calculator',{
  template: `
  <h4>{{ calculatorName }}</h4>
  <form v-on:submit.prevent="calculateResult(calculation)">
    <div class="inputs-container">
      <calculator-inputs
        v-for="input in calculatorInputs"
          v-bind:calculatorInputLabel="input.label"
          v-bind:unitInfo="input.unit"
          v-model="input.inputValue"
      />
    </div>
    <button>Calculate</button>
  </form>
  <div class="answer-container">
    <p :id=calculation class="answer-text">{{ calculatorOutput }}</p>
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
        const cfmSquare = Math.pow(cfmRatio, 2)
        const newStatic = cfmSquare * this.calculatorInputs[2].inputValue
        let answerText = document.getElementById('cfmToStatic')
        answerText.innerText = 'in WC = ' + newStatic.toFixed(5)
      } else if (calculation === 'rpmToCfm') {
        const newRpm = (this.calculatorInputs[2].inputValue / this.calculatorInputs[1].inputValue) * this.calculatorInputs[0].inputValue
        const answerText = document.getElementById('rpmToCfm')
        answerText.innerText = 'rpm = ' + newRpm.toFixed(5)
      } else if (calculation === 'cfmToAmp') {
        const cfmRatio = this.calculatorInputs[1].inputValue / this.calculatorInputs[2].inputValue
        const cfmCube = Math.pow(cfmRatio, 3)
        const newAmp = cfmCube * this.calculatorInputs[0].inputValue
        let answerText = document.getElementById('cfmToAmp')
        answerText.innerText = 'amp = ' + newAmp.toFixed(5)
      } else {
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
        (<em>{{ unitInfo }}</em>)</p>
        <input type="number" step="any" v-model="calculatorInputValue" />
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