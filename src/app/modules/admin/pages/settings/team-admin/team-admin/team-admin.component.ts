import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatSelectModule } from '@angular/material/select';  
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatOptionModule } from '@angular/material/core';  
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';  
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AgencyService } from 'app/core/services/agency-service.service';
import { Agency,Region,BizerteCities, TunisCities, NabeulCities, TozeurCities, ZaghouanCities, TataouineCities, SousseCities, SilianaCities, SidiBouzidCities, SfaxCities, MonastirCities, MedenineCities, ManoubaCities, MahdiaCities, KefCities, KebiliCities, KasserineCities, KairouanCities, JendoubaCities, GafsaCities, GabesCities, BenArousCities, BejaCities, ArianaCities } from 'app/core/Model/Agency.model';  
import { ChangeDetectorRef } from '@angular/core';
import { MatDialogModule ,MatDialog } from '@angular/material/dialog';
import { EditAgencyDialogComponent } from '../../EditAgencyDialogComponent/edit-agency-dialog/edit-agency-dialog.component';
import { AuthService } from 'app/core/auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-team-admin',
  standalone: true,
  imports: [
    CommonModule, 
    MatSlideToggleModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatOptionModule, 
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './team-admin.component.html',
  styleUrls: ['./team-admin.component.scss']
})
export class TeamAdminComponent implements OnInit, AfterViewInit {
  agencies: any[] = [];  // Data will be fetched from API
  filteredAgencies = []; // To store filtered agencies
  paginatedAgencies = [];  // Array to hold paginated data
  searchForm: FormGroup;
  agents : any [] =[]
  
  @ViewChild(MatPaginator) paginator: MatPaginator;  // Reference the paginator
  private _auth = inject(AuthService);
  pageSize = 5;  // Default page size
  pageIndex = 0;  // Default page index
  private _AgencyService = inject(AgencyService);  
  regions = Object.values(Region);  // Available regions from the model
  availableCities: string[] = [];   // Dynamically populated based on region
  
  // To track the currently expanded row
  expandedAgentUsername: string | null = null;

  constructor(private fb: FormBuilder, private agencyService: AgencyService,private cdr: ChangeDetectorRef, private dialog: MatDialog ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.searchForm = this.fb.group({
        globalSearch: [''],
        region: [''],
        city: ['']
    });

    // Listen for changes in the form and filter the table accordingly
    this.searchForm.valueChanges.subscribe(filters => {
        this.filterAgencies(filters);
    });

    // Fetch all agencies and agents
    forkJoin({
        agencies: this.agencyService.listAllAgenciesAssociatedUser(),
        agents: this._AgencyService.GetAgents()
    }).subscribe({
        next: (result) => {
            const agenciesData = result.agencies;
            const agentsData = result.agents;

            // Ensure agents have status property
            this.agents = agentsData.map(agent => ({
                ...agent,
                status: agent.status !== undefined ? agent.status : false
            }));

            // Merge status into agencies
            this.agencies = agenciesData.map(agency => {
                const matchingAgent = this.agents.find(agent => agent.id === agency.userId);
                return {
                    ...agency,
                    status: matchingAgent ? matchingAgent.status : false
                };
            });

            this.filteredAgencies = [...this.agencies];
            this.paginateAgencies();
            this.cdr.detectChanges();
        },
        error: (err) => {
            console.error('Error fetching data:', err);
        }
    });
}


  // Fetch agencies from the service
  fetchAgencies(): void {
    this.agencyService.listAllAgenciesAssociatedUser().subscribe({
      next: (data) => {
        console.log('Fetched Agencies:', data);  // Debug the fetched agencies
        this.agencies = data;
        this.filteredAgencies = [...this.agencies];  // Initialize filtered agencies
        this.paginateAgencies();  // Update pagination with fetched data
  
        // Manually trigger change detection after data arrives
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching agencies:', err);
      }
    });
  }
getagents(): void {
    this._AgencyService.GetAgents().subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
            // Ensure each agent has a status property
            this.agents = response.map(agent => ({
                ...agent,
                status: agent.status !== undefined ? agent.status : false // Default to false if missing
            }));
            console.log("Fetched Agents with status:", this.agents);
            this.cdr.detectChanges();  // Trigger change detection
        } else {
            console.warn("No valid agent data found.");
        }
    },
    error: (error) => {
        console.error("Error fetching agents:", error);
    }
});
}
toggleActivation(agency: any): void {
  if (!agency || typeof agency.userId === 'undefined') {
      console.warn("Agency or agency userId is undefined. Cannot toggle activation.");
      return;
  }

  // Store the original status
  const originalStatus = agency.status;

  // Optimistically update the status
  agency.status = !agency.status;

  // Manually trigger change detection
  this.cdr.detectChanges();

  // Make the API call
  this._auth.deactivateUser(agency.userId).subscribe({
      next: () => {
          console.log(`User with ID ${agency.userId} is now ${agency.status ? 'activated' : 'deactivated'}.`);
      },
      error: (err) => {
          // Revert the status on error
          agency.status = originalStatus;
          // Trigger change detection again
          this.cdr.detectChanges();
          console.error(`Error toggling activation:`, err);
      }
  });
}



  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.paginateAgencies();
    });
  }

  // Method to update city options based on selected region
  updateCitiesForRegion(region: Region): void {
    switch (region) {
      case Region.Ariana:
          this.availableCities = Object.values(ArianaCities);
          break;
      case Region.Beja:
          this.availableCities = Object.values(BejaCities);
          break;
      case Region.BenArous:
          this.availableCities = Object.values(BenArousCities);
          break;
      case Region.Bizerte:
          this.availableCities = Object.values(BizerteCities);
          break;
      case Region.Gabes:
          this.availableCities = Object.values(GabesCities);
          break;
      case Region.Gafsa:
          this.availableCities = Object.values(GafsaCities);
          break;
      case Region.Jendouba:
          this.availableCities = Object.values(JendoubaCities);
          break;
      case Region.Kairouan:
          this.availableCities = Object.values(KairouanCities);
          break;
      case Region.Kasserine:
          this.availableCities = Object.values(KasserineCities);
          break;
      case Region.Kebili:
          this.availableCities = Object.values(KebiliCities);
          break;
      case Region.Kef:
          this.availableCities = Object.values(KefCities);
          break;
      case Region.Mahdia:
          this.availableCities = Object.values(MahdiaCities);
          break;
      case Region.Manouba:
          this.availableCities = Object.values(ManoubaCities);
          break;
      case Region.Medenine:
          this.availableCities = Object.values(MedenineCities);
          break;
      case Region.Monastir:
          this.availableCities = Object.values(MonastirCities);
          break;
      case Region.Nabeul:
          this.availableCities = Object.values(NabeulCities);
          break;
      case Region.Sfax:
          this.availableCities = Object.values(SfaxCities);
          break;
      case Region.SidiBouzid:
          this.availableCities = Object.values(SidiBouzidCities);
          break;
      case Region.Siliana:
          this.availableCities = Object.values(SilianaCities);
          break;
      case Region.Sousse:
          this.availableCities = Object.values(SousseCities);
          break;
      case Region.Tataouine:
          this.availableCities = Object.values(TataouineCities);
          break;
      case Region.Tozeur:
          this.availableCities = Object.values(TozeurCities);
          break;
      case Region.Tunis:
          this.availableCities = Object.values(TunisCities);
          break;
      case Region.Zaghouan:
          this.availableCities = Object.values(ZaghouanCities);
          break;
      default:
        this.availableCities = [];
    }

    // Reset the city selection when region changes
    this.searchForm.patchValue({ city: '' });
  }
  openEditDialog(agency: any): void {
    const dialogRef = this.dialog.open(EditAgencyDialogComponent, {
      width: '500px',  // You can adjust the size
      data: agency      // Ensure the agency data, including id, is passed to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the agencies list with the modified agency details
        const index = this.agencies.findIndex(a => a.id === result.id);
        if (index !== -1) {
          this.agencies[index] = result;  // Update the agency in the list
          this.filterAgencies(this.searchForm.value); 
          this.fetchAgencies();

          // Initialize paginated data
          this.paginateAgencies(); // Reapply filters if any
        }
      }
    });
  }
  

  // Method to filter agencies based on form input
  filterAgencies(filters: any): void {
    const { globalSearch, region, city } = filters;
  
    this.filteredAgencies = this.agencies.filter(agency => {
      const matchesGlobalSearch =
        (agency.agencyName?.toLowerCase().includes(globalSearch.toLowerCase()) ||   // Safe check for agencyName
         agency.username?.toLowerCase().includes(globalSearch.toLowerCase()) ||     // Safe check for username
         agency.agencyCode?.toLowerCase().includes(globalSearch.toLowerCase()));    // Safe check for agencyCode
  
      const matchesRegion = region ? agency.region === region : true;
      const matchesCity = city ? agency.city === city : true;
  
      return matchesGlobalSearch && matchesRegion && matchesCity;
    });
  
    this.paginator.firstPage();  // Reset paginator when filters are applied
    this.paginateAgencies();     // Update paginated data
  }
  
  // Method to paginate the agencies data
  paginateAgencies(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedAgencies = this.filteredAgencies.slice(start, end);
  }

  // Toggle activation status of an agency
 // In team-admin.component.ts

// In team-admin.component.ts




  // Method to toggle row expansion
  toggleRowExpansion(agentUsername: string): void {
    if (this.expandedAgentUsername === agentUsername) {
      this.expandedAgentUsername = null; // Collapse if already expanded
    } else {
      this.expandedAgentUsername = agentUsername; // Expand the selected row
    }
  }
}
