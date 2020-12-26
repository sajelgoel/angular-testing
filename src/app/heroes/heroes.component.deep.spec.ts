import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

@Directive({
    selector:'[routerLink]',
    host: { '(click)': 'onClick()'}
})
class RouterLinkDirectiveStub{
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick(){
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (deep test)',()=>{

    let fixture:ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(()=>{

        HEROES = [
            {id:1, name: 'SpiderDude', strength:8},
            {id:2, name: 'Wonderful Woman', strength:24},
            {id:3, name: 'SuperDude', strength:55},
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes','addHero','deleteHero'])

        TestBed.configureTestingModule({
            declarations:[HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
            providers:[
                //long hand way
                { provide: HeroService, useValue: mockHeroService  }
            ],
            //schemas:[NO_ERRORS_SCHEMA]
        })

        fixture = TestBed.createComponent(HeroesComponent);

        
    });

    it('should render each hero as a HeroComponent',()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngoninit
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));

        expect(heroComponentDEs.length).toEqual(3);



        for(let i = 0; i < heroComponentDEs.length; i++){
            expect(heroComponentDEs[i].componentInstance.hero).toBe(HEROES[i]);
        }

    });

    it(`should call heroService.deleteHero when the Hero's 
        component delete button is clicked`,()=>{

            spyOn(fixture.componentInstance, 'delete');

            mockHeroService.getHeroes.and.returnValue(of(HEROES));
            fixture.detectChanges();

            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
            //event is raised by HTML of child component
            // heroComponents[0].query(By.css('button'))
            //     .triggerEventHandler('click',{stopPropagation:()=>{}});

            //event is raised directly form ts file of child component
            //(<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

            //event is raised by html file of parent component
            // 'delete' is output of child component
            heroComponents[0].triggerEventHandler('delete', undefined);
            
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    });


    it(`should add a new hero to the hero list when the add button is clicked`,()=>{

        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const name = "Mr. Ice";
        mockHeroService.addHero.and.returnValue(of({id:4, name:name, strength:11}));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

        const addbutton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addbutton.triggerEventHandler('click', null);

        //bind new value
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;

        expect(heroText).toContain(name);

    });

    it('should have the correct route for the first hero',()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
                            .query(By.directive(RouterLinkDirectiveStub))
                            .injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click',null);

        expect(routerLink.navigatedTo).toBe('/detail/1');
    });

})