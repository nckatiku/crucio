<?php
  
require_once('../tcpdf/tcpdf.php');

$app->group('/pdf', function () use ($app) {

	$app->get('/:view', function($view) use ($app) {
		$mysql = start_mysql();
		
		$question_id_list_string = urldecode($app->request()->params('question_id_list'));
		$question_id_list = explode(",", $question_id_list_string);
		
		$collection_info_string =  urldecode($app->request()->params('collection_info'));
		$collection_info = json_decode(",", $collection_info_string);
		
		$questions = get_all($mysql, "SELECT * FROM questions WHERE question_id IN ($question_id_list_string)", []);
		
		foreach ($questions as &$question) {
  		$question['answers'] = unserialize($question['answers']);
  		$question['info'] = get_fetch($mysql, "SELECT * FROM exams WHERE exam_id = ?", [$question['exam_id']]);
  		$question['comments'] = get_all($mysql, "SELECT * FROM comments WHERE question_id = ? ORDER BY comment_id ASC", [$question['question_id']]);
		}
		unset($question);
		
		
		class crucioPDF extends TCPDF {
      function Header() {
        $this->Ln(14);
        $this->SetFont('helvetica', '', 22);
        $this->MultiCell(0, 0, 'Crucio', 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
    	}
    
      function Footer() {
        $this->SetY(-30);
        $this->SetFont('helvetica', '', 10);
        $this->Ln(5);
        $txt = 'Seite %s von %s';
        if (empty($this->pagegroups)) {
            $txt = sprintf($txt, $this->PageNo(), $this->getAliasNbPages());
        } else {
            $txt = sprintf($txt, $this->getGroupPageNo(), $this->getPageGroupAlias());
        }
        $this->MultiCell(0, 0, $txt, 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        $this->MultiCell(0, 0, 'Crucio | Sturamed', 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y, 'http://www.crucio-leipzig.de');
      }
    }
		
		
		$pdf = new crucioPDF('P', PDF_UNIT, 'A4', true, 'UTF-8', false, true);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Crucio');
    
    $pdf->SetTitle('Sammlung PDF');
    $pdf->SetMargins(PDF_MARGIN_LEFT, 35, PDF_MARGIN_RIGHT);
    $pdf->AddPage('P', 'A4');
    
  
    
    if ($view == "both" OR $view == "collection") {
      for ($i = 0; $i < count($questions); $i++) {
      	$question = $questions[$i];
      	$number = $i+1;
      
      	$pdf->SetFont('helvetica', 'B', 11);
      
      	$y = $pdf->GetY();
      	if ($y > 222) {
      		$pdf->AddPage('P', 'A4');
      	}
      	$pdf->Cell(8, 4, $number.') ');
      
      
      	// Image
      	if ($image_name) {
      		$pdf->Image('public/files/'.$question['question_image_url'], 133, $pdf->GetY(), 60, 0);
      		$pdf->SetFont('helvetica', '', 11);
      		$pdf->writeHTMLCell(106, 4, '', '', $question['question'], false, 1, 0, false, 'L', true);
      
      	} else {
      		$pdf->SetFont('helvetica', '', 11);
      		// $pdf->MultiCell(0, 0, $question, 0, 'C', false, 1);
      		$pdf->writeHTMLCell(0, 4, '', '', $question['question'], false, 1, 0, false, 'L', true);
      	}
      
      
      	// Print Answers
      	if ($question['type'] > 1) {
      		$pdf->Ln(6);
      		for ($j = 0; $j < count($question['answers']); $j++) {
        		$answer = $question['answers'][$j];
      			if (strlen($answer) > 0) {
      				$pdf->SetFont('helvetica', '', 11);
      				$pdf->Cell(18);
      				$pdf->Rect(28, $pdf->GetY()+1, 3, 3, '', $style4, array(220, 220, 200));
      				$pdf->Cell(1);
      				$pdf->writeHTMLCell(0, 3.5, '', '', $answer, false, 1, 0, true, 'L', true);
      				$pdf->Ln(4);
      			}
      		}
      	}
      	
      	
      
      	$pdf->Ln(8);
      }
    }
    
    if ($view == "both" OR $view == "solution") {
      $pdf->AddPage('P', 'A4');
      $pdf->SetFont('helvetica', '', 15);
      $pdf->MultiCell(0, 10, 'Lösungen', 0, 'C', false, 1);
      
      for ($i = 0; $i < count($questions); $i++) {
        $question = $questions[$i];
      	$number = $i+1;
      
      	$correct_answer = $question['correct_answer'];
      
      	if ($correct_answer == '0') {
      		$correct_answer = '?';
      	}
      
      	$pdf->SetFont('helvetica', '', 11);
      	$pdf->Cell(18, 4, ''.$number.') ', 0, 0, 'C');
      
      	if ($question['type'] == '1') {
      		$correct_answer = $question['answers'][0];
      		$pdf->SetFont('helvetica', '', 11);
      		$pdf->writeHTMLCell(48, 4, '', '', $correct_answer, false, 1, 0, false, 'L', true);
      	} else {
      		$pdf->SetFont('helvetica', 'B', 11);
      		$pdf->Cell(20, 4, $correct_answer, 0, 0, 'C');
      	}
      
      	$pdf->SetFont('helvetica', '', 11);
      	// $pdf->MultiCell(140, 4, utf8_decode($questions[$i]['explanation']));
      	$pdf->Ln(5);
      }
    }
    

		$response = $app->response();
    $response->header("Content-Type", "application/pdf");
    $response->body($pdf->Output('crucio-klausur.pdf', 'I'));
	});
});

?>
