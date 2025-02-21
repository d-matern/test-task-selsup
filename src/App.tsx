import './App.css'

import React, { ChangeEvent, useRef } from "react";

type ParamType = 'string' | 'number';
interface Param {
  id: number;
  name: string;
  type: ParamType;
}
interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  paramId: number;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}
interface Props {
  params: Param[];
  model: Model;
}

type FormState = {
  [key: Param['id']]: {
    param: Param;
    value: string;
    color: string;
  }
};

type State = {
  formState: FormState;
  isShow: boolean;
};

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formState: this.initState(props.params, props.model.paramValues, props.model.colors),
      isShow: false
    };
    this.getModel = this.getModel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public getModel(): Model {
    const paramValues: ParamValue[] = [];
    const colors: Color[] = [];

    Object.keys(this.state.formState).forEach((key) => {
        const param = this.state.formState[+key];
        if (param) {
          paramValues.push({ paramId: +key, value: param.value });
          colors.push({ paramId: +key, value: param.color })
        }
    });

    return { paramValues, colors };
  }

  private handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const field = e.target;
    this.setState(prevState => ({
      formState: {
        ...prevState.formState,
        [field.name]: {
          ...prevState.formState[+field.name],
          value: field.value
        }
      }
    }));
  }

  private initState = (params: Param[], paramValues: ParamValue[], colors: Color[]) => {
    return params.reduce<FormState>((acc, p) => {
      acc[p.id] = {
        param: p,
        value: paramValues.find(v => v.paramId === p.id)?.value || "",
        color: colors.find(v => v.paramId === p.id)?.value || ""
      };
      return acc;
    }, {})
  }

  render(): React.ReactNode {
    return (
      <div className='container'>
          <h1>ParamEditor</h1>
          {
            Object.keys(this.state.formState).map(
              (key) => {
                const state = this.state.formState[+key];
                return <label key={key}>
                  <span className='label__name'>{state.param.name}</span>
                  <input
                    type={state.param.type}
                    name={key}
                    defaultValue={state.value}
                    onChange={this.handleChange}
                  />
                </label>
              }
            )
          }
      </div>
    )
  }
}

function App() {
  const paramEditorRef = useRef<ParamEditor | null>(null);
  
  const handleClick = () => {
    if (paramEditorRef.current) {
      const { paramValues, colors } = paramEditorRef.current.getModel();
      console.log({ paramValues, colors });
    }
  }
  return (
    <>
      <div>
        <ParamEditor
          ref={paramEditorRef}
          params={[
            {
              id: 1,
              name: "Назначение",
              type: 'string'
            },
            {
              id: 2,
              name: "Длина",
              type: 'string'
            },
            {
              id: 3,
              name: "Тест",
              type: 'number'
            }
          ]}

          model={{
            paramValues: [
              {
                paramId: 1,
                value: "повседневное"
              },
              {
                paramId: 2,
                value: "макси"
              }
            ],
            colors: [
              {
                paramId: 1,
                value: "green"
              },
              {
                paramId: 2,
                value: "blue"
              }
            ] 
          }}
        />
      </div>

      <button className='button' onClick={handleClick}>Получить данные в консоль</button>
    </>
  )
}

export default App;
