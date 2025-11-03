export class SectionDto {
  title: string;
  lessons?: string[];
  initialLesson?: {
    name: string;
    material?: string;
    embedVideo: string;
    hour: number;
    minute: number;
    second: number;
  };
}
