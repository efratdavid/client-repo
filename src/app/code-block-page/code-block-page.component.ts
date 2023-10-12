import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodeBlockService } from '../code-block.service';
import { SocketService } from '../socket.service';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

@Component({
  selector: 'app-code-block-page',
  templateUrl: './code-block-page.component.html',
  styleUrls: ['./code-block-page.component.css']
})
export class CodeBlockPageComponent implements OnInit {
  codeBlockId!: string | null;
  code!: string;
  title!: string;
  isMentor: boolean = false;

  @ViewChild('codeEditor')
  codeEditor!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private codeBlockService: CodeBlockService,
    private socketService: SocketService
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
        this.isMentor = isMentor;
      });
    });

    // Listen for code changes in the code editor
    this.codeEditor.nativeElement.addEventListener('input', () => {
      // Automatically send code updates to the server via Socket.io
      this.socketService.emit('code-update', { id: this.codeBlockId, code: this.code });
    });
    
    // Apply syntax highlighting to the code using Highlight.js
    this.highlightCode();
  }

  highlightCode() {
    // Register JS language 
    hljs.registerLanguage('javascript', javascript);

    // Get the code element
    const codeElement = document.getElementById('code');
    if (codeElement) {
      // Apply syntax highlighting
      hljs.highlightBlock(codeElement);
    }
  }
}
