<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::with(['intakeForms', 'appointments'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:patients,email',
                'phone' => 'required|string|max:20',
                'dateOfBirth' => 'required|date',
                'gender' => 'required|string|in:male,female,other,prefer-not-to-say',
                'address' => 'required|string',
                'emergencyContact.name' => 'required|string|max:255',
                'emergencyContact.phone' => 'required|string|max:20',
                'emergencyContact.relationship' => 'required|string|max:255',
            ]);

            $patient = Patient::create([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'date_of_birth' => $validated['dateOfBirth'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'emergency_contact_name' => $validated['emergencyContact']['name'],
                'emergency_contact_phone' => $validated['emergencyContact']['phone'],
                'emergency_contact_relationship' => $validated['emergencyContact']['relationship'],
            ]);

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient created successfully'
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show($id): JsonResponse
    {
        $patient = Patient::with(['intakeForms', 'appointments'])->find($id);
        
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $patient = Patient::find($id);
        
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'firstName' => 'sometimes|string|max:255',
                'lastName' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:patients,email,' . $id,
                'phone' => 'sometimes|string|max:20',
                'dateOfBirth' => 'sometimes|date',
                'gender' => 'sometimes|string|in:male,female,other,prefer-not-to-say',
                'address' => 'sometimes|string',
                'emergencyContact.name' => 'sometimes|string|max:255',
                'emergencyContact.phone' => 'sometimes|string|max:20',
                'emergencyContact.relationship' => 'sometimes|string|max:255',
            ]);

            $updateData = [];
            if (isset($validated['firstName'])) $updateData['first_name'] = $validated['firstName'];
            if (isset($validated['lastName'])) $updateData['last_name'] = $validated['lastName'];
            if (isset($validated['email'])) $updateData['email'] = $validated['email'];
            if (isset($validated['phone'])) $updateData['phone'] = $validated['phone'];
            if (isset($validated['dateOfBirth'])) $updateData['date_of_birth'] = $validated['dateOfBirth'];
            if (isset($validated['gender'])) $updateData['gender'] = $validated['gender'];
            if (isset($validated['address'])) $updateData['address'] = $validated['address'];
            if (isset($validated['emergencyContact']['name'])) $updateData['emergency_contact_name'] = $validated['emergencyContact']['name'];
            if (isset($validated['emergencyContact']['phone'])) $updateData['emergency_contact_phone'] = $validated['emergencyContact']['phone'];
            if (isset($validated['emergencyContact']['relationship'])) $updateData['emergency_contact_relationship'] = $validated['emergencyContact']['relationship'];

            $patient->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient updated successfully'
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy($id): JsonResponse
    {
        $patient = Patient::find($id);
        
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $patient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patient deleted successfully'
        ]);
    }

    public function intakeForms($id): JsonResponse
    {
        $patient = Patient::find($id);
        
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $intakeForms = $patient->intakeForms()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $intakeForms
        ]);
    }

    public function appointments($id): JsonResponse
    {
        $patient = Patient::find($id);
        
        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $appointments = $patient->appointments()->with('provider')->orderBy('appointment_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }
}