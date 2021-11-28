export const exam_type = {
  MAKE_UP_TEST: "make-up-test",
  EXAM: "exam",
  TEST: "test"
}


// model en cada prequnta es obligatorio
// question en cada prequnta es obligatorio
export const exam_sheet = {
  active: true,
  title: "string",
  date: "string|timestamp",
  aditional_info: {
    course: "integer",
    module: "daw",
    type: "exam_type"
  },
  files: [], //ver como implementar esta seccion. bytes o enlaces a archivos??
  questions: [
    // Para texto con imagen / es
    {
      title: "string",
      images: [
        {
          url: "string",
          alt: "srting"
        }
      ],
      question: "string", // campo de texto
      model: "string|number|boolean|object"
    },
    // Para texto
    {
      title: "string",
      question: "longstring", // campo de textarea
      model: "string|number|boolean|object"
    },
  ]
}