import {
  inject,
  Directive,
  ElementRef,
  ViewChild,
  DestroyRef,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { EntityForm } from './entity.form';
import { Router } from '@angular/router';

/**
 * @description
 * Fake directive
 * Class is using Angular features but is not decorated.
 * Please add an explicit Angular decorator.
 *
 * It's just a base abstraction for the schedule and team components
 */
@Directive()
export abstract class EntityContainer<
  T extends object,
  C = unknown,
  U = unknown
> {
  protected destroyRef = inject(DestroyRef);

  protected label = 'Registro';

  @ViewChild('resetRef', { static: true })
  resetButton!: MatButton;
  get resetRef() {
    return this.resetButton._elementRef;
  }

  @ViewChild('formRef', { static: true })
  formRef!: ElementRef<HTMLFormElement>;
  get formEl() {
    return this.formRef.nativeElement;
  }

  @ViewChild('sectionRef', { static: true })
  sectionRef!: ElementRef<HTMLElement>;
  get sectionEl() {
    return this.sectionRef.nativeElement;
  }

  abstract form: EntityForm<T, C, U>;

  snackBar = inject(MatSnackBar);
  private router = inject(Router);

  onSubmit(path: string) {
    if (this.form.valid) {
      let message;

      if (this.form.hasId) {
        this.update(this.form.getValue());
        message = `${this.label} alterado(a)`;
      } else {
        this.create(this.form.getValue());
        message = `${this.label} cadastrado(a)`;
      }

      this.snackBar.open(`${message} com sucesso`, 'OK', {
        duration: 3000,
      });

      this.resetRef.nativeElement.click();
      this.form.init();

      const url = ['/', path];
      this.router.navigate(url);

      this.sectionEl.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  abstract onRemove(entity: T): void;
  abstract create(updateDto: C): void;
  abstract update(updateDto: U): void;

  protected compareFn(e1: T, e2: T) {
    if (e1 && 'id' in e1 && e2 && 'id' in e2) {
      return e1.id === e2.id;
    }
    return false;
  }
}
