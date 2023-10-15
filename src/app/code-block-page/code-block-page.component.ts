import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodeBlockService } from '../code-block.service';
import { SocketService } from '../socket.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/default.css'; // Choose your desired theme
hljs.registerLanguage('javascript', javascript);


@Component({
  selector: 'app-code-block-page',
  templateUrl: './code-block-page.component.html',
  styleUrls: ['./code-block-page.component.css']
})
export class CodeBlockPageComponent implements OnInit, AfterViewInit  {
  codeBlockId!: string | null;
  code!: string;
  title!: string;
  isMentor: boolean = false;

  @ViewChild('codeEditor')
  codeEditor!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private codeBlockService: CodeBlockService,
    private socketService: SocketService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codeBlockId = params.get('id');

      // Fetch the code block by ID using HTTP
      if (this.codeBlockId !== null) {
        this.codeBlockService.getCodeBlockById(this.codeBlockId).subscribe(data => {
        this.code = data.code;
        this.title = data.title;
        });
      }

      // Listen for code updates from Socket.io server
      this.socketService.on('code-updated', (data: any) => {
        if (data.id === this.codeBlockId) {
          this.code = data.code;
        }
      });

      // Listen for the mentor flag received from the server
      this.socketService.on('mentor', (isMentor: boolean) => {
        console.log('isMentor: ', isMentor);
        this.isMentor = isMentor;
      });


      /*// Set the contenteditable property based on isMentor
      const codeDiv = this.el.nativeElement.querySelector('#code');
      this.renderer.setProperty(codeDiv, 'contenteditable', !this.isMentor);*/
    });
  }

  ngAfterViewInit(): void {
    // Listen for code changes in the code editor
    this.codeEditor.nativeElement.addEventListener('input', () => {
      // Automatically send code updates to the server via Socket.io
      this.socketService.emit('code-update', { id: this.codeBlockId, code: this.code });
    });
  
    // Apply syntax highlighting to the code using Highlight.js
    this.highlightCode();
  }

  highlightCode() {
    console.log('highlightCode called');
    
    // Register JS language 
    //hljs.registerLanguage('javascript', javascript);
    

    // Get the code element
    const codeElement = document.getElementById('code');
    if (codeElement) {
      // Apply syntax highlighting
      hljs.highlightElement(codeElement)
    }
  }
}
