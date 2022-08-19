import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Person } from './../../models/person';

import { PersonComponent } from './person.component';
import { first } from 'rxjs/operators';
import { clickEvent, getText, queryById } from 'src/testing';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.person = new Person('Nicolas', 'Molina', 28, 68, 1.65);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should the name be 'nicolas'", () => {
    expect(component.person.name).toEqual('Nicolas');
  });

  it('should have <h3> with person name', () => {
    const expectMsg = `Hola, ${component.person.name}`;
    const h3 = getText(fixture, 'h3');
    expect(h3).not.toBeNull();
    expect(h3).toEqual(expectMsg);
  });

  it('should have <p> with person height', () => {
    const expectMsg = `Mi altura es ${component.person.height}`;
    const p = getText(fixture, 'p');
    expect(p).not.toBeNull();
    expect(p).toEqual(expectMsg);
  });

  it('should display a different height', () => {
    // Arrange
    component.person.height = 999;
    const expectMsg = `Mi altura es ${component.person.height}`;
    // Act
    fixture.detectChanges();
    const p = getText(fixture, 'p');
    // Assert
    expect(p).toEqual(expectMsg);
  });

  it('should have <h3> contain  person name', () => {
    // Arrange
    const expectName = 'Valentina';
    component.person.name = expectName;
    // Act
    fixture.detectChanges();
    const h3 = getText(fixture, 'h3');
    // Assert
    expect(h3).toContain(expectName);
  });

  it('should display un text with IMC', () => {
    // Arrange
    const expectText = 'overweight';
    // Act
    component.calcIMC();
    fixture.detectChanges();
    const button = getText(fixture, 'btn-imc');
    // Assert
    expect(button).toContain(expectText);
  });

  it('should display un text with IMC with click', () => {
    // Arrange
    const expectText = 'overweight';
    // Act
    clickEvent(fixture, 'btn-imc', true);
    fixture.detectChanges();
    // Assert
    const txtBtn = getText(fixture, 'btn-imc');
    expect(txtBtn).toContain(expectText);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    const expectedPerson = new Person('Nicolas', 'Molina', 28, 68, 1.65);
    let selectedPerson: Person | undefined;
    component.onSelected.pipe(first()).subscribe((person: Person) => {
      selectedPerson = person;
    });
    // Act
    component.person = expectedPerson;
    clickEvent(fixture, 'btn-person', true);
    fixture.detectChanges();
    // Assert
    expect(selectedPerson).toEqual(expectedPerson);
  });
});

@Component({
  template: ` <app-person [person]="person" (onSelected)="onSelected($event)">
  </app-person>`,
})
class TestHostComponent {
  person: Person = new Person('Nicolas', 'Molina', 28, 68, 1.65);
  selectedPerson: Person | undefined;
  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    const expectedName = component.person.name;
    const personDe = getText(fixture, 'h3');
    expect(personDe).toContain(expectedName);
  });

  it('should raise selected event when clicked', () => {
    clickEvent(fixture, 'btn-person', true);
    fixture.detectChanges();
    expect(component.selectedPerson).toEqual(component.person);
  });
});
