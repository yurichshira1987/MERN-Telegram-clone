import React from 'react'
import {NavLink} from 'react-router-dom'
import  RegistrSuccess  from '../components/RegistrSuccess/RegistrSuccess.jsx'
import axios from 'axios'
import config from '../utils/config.json'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const validateEmail = email =>{
    const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }



class Registr extends React.Component {
    constructor(props){
        super(props)
        this.state={
            formControls:{
                name:{value:'', error:'', errItem:'', box:false},
                email:{value:'', error:'', errItem:'', box:false},
                password:{value:'', error:'', errItem:'', box:false},
                password2:{value:'', error:'', errItem:'', box:false},
            },
            success:false,
    }
}
    
    focusRedBorderBox = item =>{ 
        let formControls = {...this.state.formControls}
        formControls[item].box = true
        this.setState({formControls})
    }
    blurRedBorderBox = item =>{
        let formControls = {...this.state.formControls}
        formControls[item].box = false
        this.setState({formControls})
        //this.setState({name:{...this.state.name, box:false}})
    }
    nameValidate = e =>{
        let formControls = {...this.state.formControls}
        formControls.name.value = e.target.value
        this.setState({formControls})
       
        setTimeout(()=>{
            if(this.state.formControls.name.value.length < 5){
                formControls.name.error = 'Имя должно быть не меньше 5 символов!'
                formControls.name.errItem = 'show'
                this.setState({formControls})
                return
            }   
            formControls.name.errItem = 'hide'
            this.setState({formControls})
        },100)

        
    }
    
    emailValidate = async (e) =>{
        let formControls = {...this.state.formControls}
        formControls.email.value = e.target.value
        this.setState({formControls})
        
        if(!validateEmail(this.state.formControls.email.value)){
            return setTimeout(()=>{
                formControls.email.error = "Введите коректный email"
                formControls.email.errItem = 'show'
                this.setState({formControls})                      
            },100)
        }

        let data = { email:formControls.email.value } 
        await axios.post(`${config.url}/find_validate_email`, data)
        .then(res=>{
            if(res.data.message !== 'ок'){
                formControls.email.errItem = 'show'
                formControls.email.error = 'Такой email уже существует'
                this.setState({formControls})
            }else{
                formControls.email.errItem = 'hide'
                this.setState({formControls}) 
            }
        })
    }

    passwordValidate = e =>{
        let formControls = {...this.state.formControls}
        formControls.password.value = e.target.value
        this.setState({formControls})

        setTimeout(()=>{
            if(this.state.formControls.password.value.length < 6){
                formControls.password.error = "Пароль должен быть не меньше 6 знаков!"
                formControls.password.errItem = 'show'
                this.setState({formControls})
                return
            }
            
            formControls.password.errItem = 'hide'
            this.setState({formControls}) 
        },100)
    }
    password2Validate = e =>{
        let formControls = {...this.state.formControls}
        formControls.password2.value = e.target.value
        this.setState({formControls})

        setInterval(()=>{
            if(this.state.formControls.password2.value ===''){
                formControls.password2.error = 'Повторите пароль'
                formControls.password2.errItem = 'show'
                this.setState({formControls})
                return
                }
            if(this.state.formControls.password.value !== this.state.formControls.password2.value ){
                formControls.password2.error = 'Пароль не совпадает'
                formControls.password2.errItem = 'show'
                this.setState({formControls})
                return 
            }
            formControls.password2.errItem = 'hide'
            this.setState({formControls})
        },500)
    }
    btnSubmit = async () =>{
        // this.animationButtonClick()

        let {name, email, password, password2} = this.state.formControls
        let formControls = {...this.state.formControls}
        if(name.value ===''){
            formControls.name.error = 'Введите имя'
            formControls.name.errItem = 'show'
            this.setState({formControls})
        }
        if(email.value ===''){
            formControls.email.error = 'Введите email'
            formControls.email.errItem = 'show'
            this.setState({formControls})
        }
        if(password.value ===''){
            formControls.password.error = 'Введите пароль'
            formControls.password.errItem = 'show'
            this.setState({formControls})
        }
        if(password2.value ===''){
            formControls.password2.error = 'Повторите пароль'
            formControls.password2.errItem = 'show'
            this.setState({formControls})
        }
        
        if(email.errItem ==='hide' && name.errItem ==='hide' && password.errItem ==='hide' && password2.errItem ==='hide'){
            let colors = ['#DDF5CB', '#FAA774', '#30A3E6', '#3AE2CE', '#FFDD00', '#B34EE9', '#4CCA40', '#3AE2CE', '#E25459', '#52C285' ]
            let colorName = colors[Math.floor(Math.random() * colors.length)]
            let data = {
                name:this.state.formControls.name.value,
                email:this.state.formControls.email.value,
                password:this.state.formControls.password.value,
                password2:this.state.formControls.password2.value,
                colorName:colorName
            }
            await axios.post(`${config.url}/registr`, data)
                .then(res => {
                    console.log(res)
                    if(res.data === "Юзер создан") this.setState({success:true})               
                })
        } 
    }       
    render(){
    var {name, email, password, password2} = this.state.formControls

    return(
        <>
     {
            !this.state.success?
        <div className="registr">
            <h4>Регистрация</h4>
            <p>Для входа в чат, вам нужно Зарегистрироваться</p>
            
            <div className='startBlock'>
                <div className="form">

                <div className="inp">
                    <input 
                        onBlur={this.blurRedBorderBox.bind(this, 'email')} 
                        onFocus={this.focusRedBorderBox.bind(this, 'email')} 
                        className={(email.errItem === 'show'?'redBorder':'') + (email.box && email.errItem ==='show' ?' redBox':'')} 
                        value={email.value} 
                        onChange={this.emailValidate} 
                        placeholder="E-mail" 
                        type="text"/>

                    <i className={"fas fa-check-circle " + (email.errItem === 'hide'?'showIcon':null)}></i>
                    <i className={"fas fa-times-circle " + (email.errItem === 'show'?'showIcon':null)}></i>
                    <div className={'error '+ (email.errItem === 'show'? 'showError':'hideError')}>{email.error}</div>
                </div>

                <div className="inp">
                    <input
                        onBlur={this.blurRedBorderBox.bind(this, 'name')}
                        onFocus={this.focusRedBorderBox.bind(this, 'name')}
                        className={(name.errItem === 'show'?'redBorder':'') + (name.box && name.errItem ==='show' ?' redBox':'')} 
                        value={name.value} 
                        onChange={this.nameValidate} 
                        placeholder="Ваше имя" 
                        type="text"/>

                    <i className={"fas fa-check-circle " + (name.errItem === 'hide'?'showIcon':null)}></i>
                    <i className={"fas fa-times-circle " + (name.errItem === 'show'?'showIcon':null)}></i>
                    <div className={'error ' + (name.errItem==='show'?'showError':'hideError')}>{name.error}</div>
                </div>
        
                <div className="inp">
                    <input 
                        onBlur={this.blurRedBorderBox.bind(this, 'password')} 
                        onFocus={this.focusRedBorderBox.bind(this, 'password')} 
                        className={(password.errItem === 'show'?'redBorder':'') + (password.box && password.errItem ==='show' ?' redBox':'')} 
                        value={password.value} 
                        onChange={this.passwordValidate} 
                        placeholder="Пароль" 
                        type="password"/>

                    <i className={"fas fa-check-circle " + (password.errItem === 'hide'?'showIcon':null)}></i>
                    <i className={"fas fa-times-circle " + (password.errItem === 'show'?'showIcon':null)}></i>
                    <div className={'error ' + (password.errItem==='show'?'showError':'hideError')}>{password.error}</div>
                </div>

                <div className="inp">
                    <input 
                        onBlur={this.blurRedBorderBox.bind(this, 'password2')}
                        onFocus={this.focusRedBorderBox.bind(this, 'password2')} 
                        className={(password2.errItem === 'show'?'redBorder':'') + (password2.box && password2.errItem ==='show' ?' redBox':'')} 
                        onChange={this.password2Validate} 
                        placeholder="Повторить пароль" 
                        type="password"/>

                    <i className={"fas fa-check-circle " + (password2.errItem === 'hide'?'showIcon':null)}></i>
                    <i className={"fas fa-times-circle " + (password2.errItem === 'show'?'showIcon':null)}></i>
                    <div className={'error ' + (password2.errItem==='show'?'showError':'hideError')}>{password2.error}</div>
                </div>
                
                <div> <button  onClick={this.btnSubmit}>Зарегистрироваться</button></div>
                 <NavLink to='/'><p>Войти в аккаунт</p></NavLink>
                
                </div>
            </div>
        </div>
      
      :<RegistrSuccess
       heading={'Подтвердите свой аккаунт'}
       text={'На вашу почту отправленно письмо с ссылкой на подтверждение аккаунта'}
       route={'Назад'}
       img={ <ExclamationCircleOutlined style={{color:'#40A7E3'}}/> }
       /> 
    }
    </>
    )
    }
}

export default Registr
