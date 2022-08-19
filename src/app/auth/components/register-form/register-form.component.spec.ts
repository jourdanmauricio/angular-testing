import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/user.service';
import { getText, query, queryById } from 'src/testing';

import { RegisterFormComponent } from './register-form.component';

fdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['create']);
    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: spy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    // utilizamos los getters
    // Deberíamos tener dos it para identificar en cuál se produce el error
    // Angular nos brinda la sentencia withContext para identificarlo

    component.emailField?.setValue('este no es un correo');
    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();
    component.emailField?.setValue('');
    expect(component.emailField?.invalid)
      .withContext('empty email')
      .toBeTruthy();
  });

  it('should the passwordField be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty').toBeTruthy();
    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('12345').toBeTruthy();
    component.passwordField?.setValue('aassddffgghhjj');
    expect(component.passwordField?.invalid)
      .withContext('without numbers')
      .toBeTruthy();
    component.passwordField?.setValue('aassddffgg11');
    expect(component.passwordField?.valid).withContext('rigth').toBeTruthy();
  });

  it('should the form be invalid', () => {
    component.form.patchValue({
      name: 'Mauricio',
      email: 'jourdanm@gmail.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: false,
    });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should the emailField be invalid from UI', () => {
    // Llenando campos del formulario
    const inpuntDe = query(fixture, 'input#email');
    const inputEl: HTMLInputElement = inpuntDe.nativeElement;
    inputEl.value = 'esto no es un correo';

    // Informamos el cambio a Angular. Enviamos el evento input.
    inputEl.dispatchEvent(new Event('input'));
    // Tenemos que hacer el blur del input
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();

    // Verificamos el mensaje de error en pantalla
    const textError = getText(fixture, 'emailField-email');
    expect(textError).toContain("It's not a email");
  });
});
